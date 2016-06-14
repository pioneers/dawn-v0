/**
 * Reducer from asynchronous alerts.
 */


const asyncAlerts = (state = [], action) => {
  switch (action.type) {
    case 'ADD_ASYNC_ALERT':
      return [
        ...state,
        {
          id: action.id,
          heading: action.heading,
          message: action.message
        }
      ];
    case 'REMOVE_ASYNC_ALERT':
      return state.filter((el) => {
        return el.id !== action.id;
      });
    default:
      return state;
  }
};

export default asyncAlerts;
