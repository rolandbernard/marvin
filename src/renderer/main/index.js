
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
        };
        this.input = createRef();

        ipcRenderer.on('update-options', (_, options) => {
            this.setState({ results: options, selected: 0 });
        });
        ipcRenderer.on('update-config', (_, config) => {
            this.setState({ config: config });
        });
        ipcRenderer.on('reset', (_) => {
            this.setState({ results: [], selected: 0 });
        });
    }

    handleKeyDown(e) {
        if (e.key === 'ArrowUp' && this.state.results && this.state.results.length > 0) {
            this.setState({ selected: (this.state.results.length + this.state.selected - 1) % this.state.results.length });
            e.preventDefault();
        } else if (e.key === 'ArrowDown' && this.state.results && this.state.results.length > 0) {
            this.setState({ selected: (this.state.results.length + this.state.selected + 1) % this.state.results.length });
            e.preventDefault();
        } else if (e.key === 'Escape') {
            window.close();
        } else if (e.key === 'Enter' && this.state.results && this.state.results.length > 0) {
            ipcRenderer.send('execute-option', this.state.results[this.state.selected]);
        } else if (e.key === 'Tab' && this.state.results && this.state.results.length > 0
            && this.state.results[this.state.selected].complete) {
            this.input.current.value = this.state.results[this.state.selected].complete;
            ipcRenderer.send('search-options', this.input.current.value);
        }
    }

    handleHover(index) {
        if (index != this.state.selected) {
            this.setState({ selected: index });
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
            }
        };

        return (
            <div style={styles.root} onKeyDown={(e) => this.handleKeyDown(e)}>
                <div style={styles.content}>
                    <InputField config={this.state.config} inputRef={this.input}></InputField>
                    <div style={styles.output_area}>
                        <div style={styles.output}>
                            <div style={styles.list}>
                                <OutputList
                                    onHover={(e) => this.handleHover(e)}
                                    onExec={(e) => this.handleExec(e)}
                                    config={this.state.config}
                                    selected={this.state.selected}
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
