import buildClient from '../api/build-client';

const HomeView = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

HomeView.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get('/api/users/current_user');

  return data;
};

export default HomeView;
