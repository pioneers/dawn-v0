/**
 * Actions for the editor state.
 */

export const openFile = () => {
  return {
    type: 'OPEN_FILE'
  };
};

export const saveFile = (filepath, code) => {
  return {
    type: 'SAVE_FILE',
    code: code,
    filepath: filepath
  };
};

export const deleteFile = () => {
  return {
    type: 'DELETE_FILE'
  };
};

export const createNewFile = () => {
  return {
    type: 'CREATE_NEW_FILE'
  };
};

export const editorUpdate = (newVal) => {
  return {
    type: 'UPDATE_EDITOR',
    code: newVal
  };
};

export const changeTheme = (theme) => {
  return {
    type: 'CHANGE_THEME',
    theme: theme
  };
};

export const increaseFontsize = () => {
  return {
    type: 'INCREASE_FONTSIZE'
  };
};

export const decreaseFontsize = () => {
  return {
    type: 'DECREASE_FONTSIZE'
  };
};
