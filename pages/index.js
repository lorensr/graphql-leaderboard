import App from '../components/App'
import Header from '../components/Header'
import ReputationLeaderboard from '../components/ReputationLeaderboard'
import withData from '../lib/withData'

export default withData((props) => (
  <App>
    <Header pathname={props.url.pathname} />
    <ReputationLeaderboard />
  </App>
))
