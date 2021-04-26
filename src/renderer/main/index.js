
import 'typeface-roboto';
import 'material-icons';
import './index.css';

import React, { createRef } from 'react';
import ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron';

import OutputList from '../common/output-list';
import InputField from './input-field';
import PreviewField from './preview-field';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: null,
            results: [],
            selected: 0,
            center: true,
        };
        this.input = createRef();

        ipcRenderer.on('update-options', (_, options) => {
            clearTimeout(this.last_loading);
            clearTimeout(this.last_results);
            this.last_results = setTimeout(() => {
                this.setState({ results: options, selected: 0 });
            }, this.state.config ? this.state.config.general.incremental_result_debounce : 20);
        });
        ipcRenderer.on('update-config', (_, config) => {
            this.setState({ config: config });
        });
        ipcRenderer.on('reset', (_) => {
            this.setState({ results: [], selected: 0 });
        });
    }

    sendQueryRequest() {
        clearTimeout(this.last_query);
        this.last_query = setTimeout(() => {
            const query = this.input.current.value;
            ipcRenderer.send('search-options', query);
        }, this.state.config ? this.state.config.general.debounce_time : 20);
        clearTimeout(this.last_loading);
        this.last_loading = setTimeout(() => {
            this.setState({ results: [], selected: 0 });
        }, 100);
    }

    handleKeyDown(e) {
        if (e.key === 'ArrowUp' && this.state.results && this.state.results.length > 0) {
            this.setState({ selected: (this.state.results.length + this.state.selected - 1) % this.state.results.length, center: true });
            e.preventDefault();
        } else if (e.key === 'ArrowDown' && this.state.results && this.state.results.length > 0) {
            this.setState({ selected: (this.state.results.length + this.state.selected + 1) % this.state.results.length, center: true });
            e.preventDefault();
        } else if (e.key === 'Escape') {
            window.close();
        } else if (e.key === 'Enter' && this.state.results && this.state.results.length > 0) {
            ipcRenderer.send('execute-option', this.state.results[this.state.selected]);
        } else if (e.key === 'Tab' && this.state.results && this.state.results.length > 0 && this.state.results[this.state.selected].complete) {
            this.input.current.value = this.state.results[this.state.selected].complete;
            this.sendQueryRequest();
        }
    }

    handleHover(index) {
        if (index != this.state.selected) {
            this.setState({ selected: index, center: false });
        }
    }

    handleExec(index) {
        this.handleHover(index);
        ipcRenderer.send('execute-option', this.state.results[index]);
    }

    render() {
        const styles = {
            root: {
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            },
            content: {
                width: 'calc(100% - 20px)',
                height: 'calc(100% - 20px)',
                display: 'flex',
                flexFlow: 'column',
                overflow: 'visuble',
            },
            output_area: {
                flex: '1 1 auto',
                width: '100%',
                height: '0',
                position: 'relative',
                overflow: 'visuble',
            },
            output: {
                display: 'flex',
                flexFlow: 'row nowrap',
                width: '100%',
                height: 'min-content',
                maxHeight: '100%',
                overflow: 'hidden',
                // backdropFilter: this.state.config && `blur(${this.state.config.theme.background_blur_input}px)`,
                borderRadius: this.state.config && `0 0 ${this.state.config.theme.border_radius}px ${this.state.config.theme.border_radius}px`,
                boxShadow: this.state.config && `1px 2px 7px -2px ${this.state.config.theme.shadow_color_output}`,
            },
            list: {
                flex: '1 1 auto',
                width: '100%',
                overflow: 'hidden',
                display: 'flex',
            }
        };

        return (
            <div style={styles.root} onKeyDown={(e) => this.handleKeyDown(e)}>
                <div style={styles.content}>
                    <InputField
                        config={this.state.config}
                        inputRef={this.input}
                        onChange={() => this.sendQueryRequest()}
                    ></InputField>
                    <div style={styles.output_area}>
                        <div style={styles.output}>
                            <div style={styles.list}>
                                <OutputList
                                    onHover={(e) => this.handleHover(e)}
                                    onExec={(e) => this.handleExec(e)}
                                    config={this.state.config}
                                    selected={this.state.selected}
                                    center={this.state.center}
                                    results={this.state.results}
                                ></OutputList>
                            </div>
                            <PreviewField config={this.state.config} result={this.state.results && this.state.results[this.state.selected]}></PreviewField>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
