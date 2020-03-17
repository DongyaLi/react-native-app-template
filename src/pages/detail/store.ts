import {createStore} from 'east-store';

import {fetchConstants} from '../../api/common';

const detailStore = createStore(
  {
    count: 1,
    constants: [],
  },
  {
    onPlus: () => state => {
      const count = state.count + 1;
      state.count = count;
      return state;
    },

    onMoin: () => state => {
      const count = state.count - 1;
      state.count = count;
      return state;
    },

    fetchConstants: () => async state => {
      const result = await fetchConstants();
      if (result) {
        state.constants = result;
      }
      return state;
    },
  },
);

export default detailStore;
