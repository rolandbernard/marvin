
import 'typeface-roboto';
import 'material-icons';
import './settings.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron';
import { Drawer, Divider, List, ListItemText, ListItem, ListItemIcon, Icon, ListSubheader } from '@material-ui/core';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import FiberManualRecordOutlined from '@material-ui/icons/FiberManualRecordOutlined';

import Logo from './logo.svg';
import CONFIG_DEFINITION from './config';
import { getTranslation } from '../../common/local/locale';
import SettingsPage from './settings-page';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: null,
            selected: null,
        };

        ipcRenderer.on('update-config', (_, config) => {
            this.setState({
                config: config,
                selected: { def: CONFIG_DEFINITION[0], config: config[CONFIG_DEFINITION[0].name] }
            });
        });
    }

    selectPage(page) {
        this.setState({ selected: page });
    }

    renderConfigDrawerContent(config_def, config) {
        return config_def.map((def) => (
            def.type === 'page'
                ? <ListItem
                    button key={def.name}
                    selected={this.state.selected && this.state.selected.def === def}
                    onClick={() => this.selectPage({ def: def, config: config && config[def.name] })}
                >
                    <ListItemIcon>{
                        def.icon
                            ? <Icon>{def.icon}</Icon>
                            : def.active
                                ? config && config[def.name] && config[def.name][def.active]
                                    ? <FiberManualRecord></FiberManualRecord>
                                    : <FiberManualRecordOutlined></FiberManualRecordOutlined>
                                : null
                    }</ListItemIcon>
                    <ListItemText primary={getTranslation(this.state.config, def.name)} />
                </ListItem>
                : def.type === 'subheader'
                    ? [
                        <Divider key={'__divider_' + def.name}></Divider>,
                        <ListSubheader key={def.name}>{getTranslation(this.state.config, def.name)}</ListSubheader>,
                        this.renderConfigDrawerContent(def.pages, config && config[def.name])
                    ]
                    : null
        ));
    }

    onUpdate() {
        ipcRenderer.send('update-config', this.state.config);
        this.setState({ config: this.state.config });
    }

    render() {
        const styles = {
            root: {
                width: '100%',
                height: '100%',
                display: 'flex',
                flexFlow: 'row',
                background: '#f0f0f0',
                // background: this.state.config && this.state.config.theme.background_color,
                // color: this.state.config && this.state.config.theme.text_color,
            },
            drawer: {
                flex: '0.5 1 20rem',
            },
            settings: {
                flex: '1 1 70%',
                overflow: 'overlay',
            },
            paper: {
                width: '100%',
                position: 'relative',
                whiteSpace: 'nowrap',
                overflow: 'overlay',
                // background: this.state.config && this.state.config.theme.background_color,
                // color: this.state.config && this.state.config.theme.text_color,
            },
            logo: {
                maxWidth: '5rem',
                display: 'inline-block',
                margin: '0.5rem',
                verticalAlign: 'middle',
            },
            title: {
                display: 'inline-block',
                verticalAlign: 'middle',
                fontSize: '3rem',
            },
            top: {
                marginTop: '2rem',
            },
            version: {
                color: 'grey',
                fontSize: '0.75rem',
                paddingBottom: '1rem',
                paddingLeft: '1rem',
            },
        };
        return (
            <div style={styles.root}>
                <Drawer variant="permanent" anchor="left" style={styles.drawer} PaperProps={{ style: styles.paper }}>
                    <div style={styles.top}><img src={Logo} style={styles.logo}></img><div style={styles.title}>Settings</div></div>
                    <div style={styles.version}>v{this.state.config && this.state.config.version}</div>
                    <Divider />
                    <List>
                        {this.renderConfigDrawerContent(CONFIG_DEFINITION, this.state.config)}
                    </List>
                </Drawer>
                <div style={styles.settings}>
                    <SettingsPage page={this.state.selected} onUpdate={() => this.onUpdate()} config={this.state.config}></SettingsPage>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
