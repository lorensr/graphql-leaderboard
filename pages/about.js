import App from '../components/App'
import Header from '../components/Header'

export default (props) => (
  <App>
    <Header pathname={props.url.pathname} />
    <article>
      <h1>About</h1>
      <p>
        Built for the <a href='https://dev-blog.apollodata.com/announcing-the-neo4j-graphql-community-graph-hackathon-c9a94f246c7'>Neo4j GraphQL Community Graph Hackathon</a> 🤓😄
      </p>
    </article>
  </App>
)
