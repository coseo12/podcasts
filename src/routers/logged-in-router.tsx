import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../pages/404';
import { EditProfile } from '../pages/edit-profile';
import { Dashboard } from '../pages/host/dashboard';
import { Podcasts } from '../pages/listener/podcasts';
import { Podcast } from '../pages/listener/podcast';
import { CreatePodcast } from '../pages/host/create-podcast';
import { EditPodcast } from '../pages/host/edit-podcast';
import { PodcastHost } from '../pages/host/podcast';
import { CreateEpisode } from '../pages/host/create-episode';
import { EditEpisode } from '../pages/host/edit-episode';
import { Search } from '../pages/listener/search';

const commonRoutes = [{ path: '/edit-profile', component: <EditProfile /> }];

const listenerRouter = [
  { path: '/', component: <Podcasts /> },
  { path: '/podcast/:id', component: <Podcast /> },
  { path: '/search/:term', component: <Search /> },
];

const hostRouter = [
  { path: '/', component: <Dashboard /> },
  { path: '/create-podcast', component: <CreatePodcast /> },
  { path: '/edit-podcast/:id', component: <EditPodcast /> },
  { path: '/podcast-detail/:id', component: <PodcastHost /> },
  { path: '/create-episode/:podcastId', component: <CreateEpisode /> },
  { path: '/edit-episode/:podcastId/:episodeId', component: <EditEpisode /> },
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Switch>
        {commonRoutes.map(route => (
          <Route key={route.path} exact path={route.path}>
            {route.component}
          </Route>
        ))}
        {data.me.role === 'Host' &&
          hostRouter.map(route => (
            <Route key={route.path} exact path={route.path}>
              {route.component}
            </Route>
          ))}
        {data.me.role === 'Listener' &&
          listenerRouter.map(route => (
            <Route key={route.path} exact path={route.path}>
              {route.component}
            </Route>
          ))}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
