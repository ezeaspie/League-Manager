import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import CreateLeagueInterface from './components/CreateLeagueInterface';

export default function App() {
  const [currentView, setCurrentView] = useState(0);

  const updateCurrentView = (newViewValue) => {
    setCurrentView(newViewValue);
    return newViewValue;
  };

  // Functions that update views
  const renderMainMenu = () => (
    <MainMenu updateCurrentView={updateCurrentView} />
  );

  const renderCreateLeagueInterface = () => (
    <CreateLeagueInterface updateCurrentView={updateCurrentView} />
  );

  const views = [
    renderMainMenu,
    renderCreateLeagueInterface,
  ];

  return (
    <div className="content-container">
      {views[currentView]()}
    </div>
  );
}
