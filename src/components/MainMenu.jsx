/* eslint-disable no-alert */
import React from 'react';
import PropTypes from 'prop-types';

const { dialog } = require('electron').remote;
const fs = require('fs');

const MainMenu = (props) => {
  const loadFile = () => {
    dialog.showOpenDialog((fileName) => {
      if (fileName === undefined) {
        // eslint-disable-next-line no-undef
        window.alert('No file selected');
        return;
      }
      fs.readFile(fileName[0], 'utf-8', (err, data) => {
        if (err) {
        // eslint-disable-next-line no-undef
          window.alert(`An error ocurred reading the file : ${err.message}`);
          return;
        }
        props.updateCurrentView(2, JSON.parse(data));
      });
    });
  };

  return (
    <div className="main-menu">
      <h1 className="main-menu title">League Manager</h1>
      <div className="main-menu buttons">
        <button
          onClick={() => props.updateCurrentView(1)}
          className="main-menu button"
        >Create New League</button>
        <button
          className="main-menu button"
          onClick={loadFile}
        >Load League</button>
      </div>
    </div>
  );
};

MainMenu.propTypes = {
  updateCurrentView: PropTypes.func.isRequired,
};

export default MainMenu;
