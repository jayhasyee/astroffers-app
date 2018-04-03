import * as React from 'react';
import { BackHandler } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from './store';
import App from './components/App';
import { closeDetails } from './actions';

export default class extends React.PureComponent {
  state = {
    store: null
  };

  async componentDidMount() {
    const store = await createStore();
    this.setState({ store });
    BackHandler.addEventListener('hardwareBackPress', () => {
      const state = store.getState();
      if (state.openedDetails) {
        store.dispatch(closeDetails());
        return true;
      } else {
        return false;
      }
    });
  }

  render() {
    return this.state.store ? (
      <Provider store={this.state.store}>
        <App />
      </Provider>
    ) : null;
  }
}
