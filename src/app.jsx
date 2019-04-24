import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import CreateLeagueInterface from './components/CreateLeagueInterface';
import LeagueInterface from './components/LeagueInterface';

let storedData;

export default function App() {
  const [currentView, setCurrentView] = useState(0);

  const updateCurrentView = (newViewValue, context = undefined) => {
    if (newViewValue === 2) {
      console.log(context);
      storedData = context;
      console.log(storedData);
    }
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

  const renderLeagueInterface = () => {
    console.log(storedData);
    return <LeagueInterface leagueData={storedData} />;
  };

  const views = [
    renderMainMenu,
    renderCreateLeagueInterface,
    renderLeagueInterface,
  ];

  return (
    <div className="content-container">
      {views[currentView]()}
    </div>
  );
}
