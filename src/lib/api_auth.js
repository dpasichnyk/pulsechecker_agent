import metrics from './metrics';

function getKnownUser(apiKey) {
  const knownUsers = { iPTYMUo2gM1vt2XAHCHJ: { name: 'pulsechecker-dashboard', permissions: [] } };
  return knownUsers[apiKey];
}

export default async function authenticate(apiKey) {
  const knownUser = getKnownUser(apiKey);
  const authenticatedUser = knownUser || (apiKey ? `unknown-user-for-key-${apiKey}` : 'user-without-key');

  metrics.create('api_auth', { user: authenticatedUser });

  return knownUser || false;
}
