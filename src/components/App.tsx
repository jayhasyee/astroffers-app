import * as React from 'react';
import { View, DrawerLayoutAndroid, ToolbarAndroid } from 'react-native';

export default class extends React.PureComponent {
  drawer: DrawerLayoutAndroid;

  toggleDrawer = () => {
    this.drawer.openDrawer();
  };

  onActionSelected = position => {
    console.log(position);
  };

  renderDrawer = () => {
    return null;
  };

  render() {
    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={this.renderDrawer}
        ref={drawer => (this.drawer = drawer)}
      >
        <View style={{ flex: 1, marginTop: 0, backgroundColor: '#f8f8f8' }}>
          <ToolbarAndroid
            navIcon={{ uri: 'ic_action_menu' }}
            overflowIcon={{ uri: 'ic_action_more_vert' }}
            titleColor="white"
            style={{ height: 56, backgroundColor: '#01579b', alignSelf: 'stretch', elevation: 5 }}
            title="Astroffers"
            actions={[ { title: 'Help', show: 'never' }, { title: 'About', show: 'never' } ]}
            onIconClicked={this.toggleDrawer}
            onActionSelected={this.onActionSelected}
          />
        </View>
      </DrawerLayoutAndroid>
    );
  }
}
