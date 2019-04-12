import React from 'react';
import PropTypes from 'prop-types';

const MainMenu = props => (
  <div className="main-menu">
    <button
      onClick={() => props.updateCurrentView(1)}
      className="main-menu_button"
    >Create New League</button>
    <button className="main-menu_button" />
    <button className="main-menu_button" />
  </div>
);

MainMenu.propTypes = {
  updateCurrentView: PropTypes.func.isRequired,
};

export default MainMenu;
