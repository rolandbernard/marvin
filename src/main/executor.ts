
import { Query } from 'common/query';
import { ModuleId } from 'common/module';
import { getResultKey, Result } from 'common/result';

import { moduleForId, modules } from 'main/modules';
import { config } from 'main/config';

/// Checks whether there exists a prefix that applies to this query. If one exists only return
/// modules that fit that prefix, otherwise, return all modules that don't require a prefix.
function findPossibleModules(query: Query): ModuleId[] {
    if (config.general.exclusive_module_prefix) {
        let prefix = '';
        for (const id of Object.keys(modules)) {
            if (config.modules[id] && config.modules[id]!.active && query.raw.startsWith(config.modules[id]!.prefix)) {
                if (config.modules[id]!.prefix.length > prefix.length) {
                    prefix = config.modules[id]!.prefix;
                }
            }
        }
        if (prefix.length !== 0) {
            return Object.keys(modules)
                .filter(id => config.modules[id] && config.modules[id]!.active)
                .filter(id => config.modules[id]?.prefix === prefix);
        }
    } else {
        const result = Object.keys(modules)
            .filter(id => config.modules[id] && config.modules[id]!.active)
            .filter(id => query.raw.startsWith(config.modules[id]!.prefix));
        if (result.length !== 0) {
            return result;
        }
    }
    return Object.keys(modules)
        .filter(id => !config.modules[id] || (config.modules[id]!.active && !config.modules[id]!.prefix));
}

async function searchQueryInModule(id: ModuleId, query: Query): Promise<Result[]> {
    try {
        query = query.withoutPrefix(config.modules[id]?.prefix ?? '');
        return (await modules[id].search?.(query)) ?? [];
    } catch (e) {
        return [];
    }
}

function filterAndSortQueryResults(results: Result[]): Result[] {
    const existing = new Set<string>();
    return results
        .filter(option => option.quality > 0)
        .sort((a, b) => b.quality - a.quality)
        .filter(element => {
            let value = getResultKey(element);
            if (!existing.has(value)) {
                existing.add(value);
                return true;
            } else {
                return false;
            }
        })
        .slice(0, config.general.max_results);
}

export async function searchQuery(query: Query, callback?: (results: Result[]) => unknown): Promise<Result[]> {
    let results: Result[] = [];
    const modules = findPossibleModules(query);
    await Promise.all(
        modules.map(async id => {
            const result = await searchQueryInModule(id, query);
            results.push(...result);
            if (callback) {
                results = filterAndSortQueryResults(results);
                callback(results);
            }
        })
    );
    return filterAndSortQueryResults(results);
}

export async function executeResult(result: Result) {
    await Promise.all(
        Object.values(modules)
            .map(module => module.executeAny?.(result).catch(() => { /* Ignore erros */ }))
    );
    await moduleForId(result.module)?.execute?.(result).catch(() => { /* Ignore erros */ });
}

