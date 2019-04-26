import React from 'react';
import PropTypes from 'prop-types';

const { dialog } = require('electron').remote;
const fs = require('fs');

const loadFile = () => {
  console.log("running");
  dialog.showOpenDialog((fileName) => {
    if (fileName === undefined) {
      window.alert('No file selected');
      return;
    }
    fs.readFile(fileName[0], 'utf-8', (err, data) => {
      if (err) {
          window.alert("An error ocurred reading the file :" + err.message);
          return;
      }
      // Change how to handle the file content
      console.log("The file content is : " + data);
      return;
    });
  });
};

const MainMenu = props => (
  <div className="main-menu">
    <button
      onClick={() => props.updateCurrentView(1)}
      className="main-menu_button"
    >Create New League</button>
    <button
      className="main-menu_button"
      onClick={loadFile}
    >Load League</button>
    <button className="main-menu_button" />
  </div>
);

MainMenu.propTypes = {
  updateCurrentView: PropTypes.func.isRequired,
};

export default MainMenu;
