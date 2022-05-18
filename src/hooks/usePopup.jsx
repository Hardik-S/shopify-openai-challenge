import { useReducer } from 'react';

export const usePopup = () => {
  const actionTypes = {
    SETTINGS_CHANGE: 'SETTINGS_CHANGE',
    SETTINGS_RESET: 'SETTINGS_RESET'
  };

  const initialState = {
    isOpen: false,
    message: '',
    action: '',
    onActionClick: () => {}
  };

  const reducer = (state, action) => {
    switch (action.type) {
    case actionTypes.SETTINGS_CHANGE:
      return {
        ...state,
        [action.payload.name]: action.payload.value
      };
    case actionTypes.SETTINGS_RESET:
      return initialState;
    default:
      return state;
    }
  };

  const [popupSettings, dispatch] = useReducer(reducer, initialState);

  const changePopupSettings = (settings) => {
    for (const key in settings) {
      dispatch({
        type: actionTypes.SETTINGS_CHANGE,
        payload: {
          name: key,
          value: settings[key]
        }
      });
    }
  };

  const closePopup = () => {
    dispatch({ type: actionTypes.SETTINGS_RESET });
  };

  return [popupSettings, { changePopupSettings, closePopup }];
};
