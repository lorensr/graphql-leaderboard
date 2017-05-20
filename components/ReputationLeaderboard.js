import { gql, graphql } from 'react-apollo'

// https://twitter.com/lorendsr/status/865693795601592320
const USERS_STARTING_OFFSET = 12821

const USERS_PER_PAGE = 100

function ReputationLeaderboard ({ data: { User, loading }, loadMoreUsers }) {
  if (User && User.length) {
    return (
      <section>
        <h1>GraphQL Community Reputation Leaderboard</h1>
        <table>
          <tr>
            <th>Rank</th>
            <th>Reputation</th>
            <th>Name</th>
          </tr>
          {User.map((user, index) =>
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.reputation}</td>
              <td>{user.name}</td>
            </tr>
          )}
        </table>
        {/* <button onClick={() => loadMoreUsers()}>
          {loading ? 'Loading...' : 'Show More'}
        </button> */}

        <style jsx>{`
          section {
            padding-bottom: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          li {
            display: block;
            margin-bottom: 10px;
          }
          div {
            align-items: center;
            display: flex;
          }
          a {
            font-size: 14px;
            margin-right: 10px;
            text-decoration: none;
            padding-bottom: 0;
            border: 0;
          }
          span {
            font-size: 14px;
            margin-right: 5px;
          }
          ul {
            margin: 0;
            padding: 0;
          }
          button:before {
            align-self: center;
            border-style: solid;
            border-width: 6px 4px 0 4px;
            border-color: #ffffff transparent transparent transparent;
            content: "";
            height: 0;
            margin-right: 5px;
            width: 0;
          }
          th {
            text-align: left;
          }
          th, td {
            padding: 0 10px 0 10px;
          }
        `}</style>
      </section>
    )
  }
  return <div>Loading</div>
}

// TODO variables not working w/ neo4j's server:
//
// graphql.language.VariableReference cannot be cast to graphql.language.IntValue
// https://graphql.communitygraph.org/graphiql/?query=query%20usersByReputation(%24first%3A%20Int!%2C%20%24offset%3A%20Int!)%20%7B%0A%20%20User(orderBy%3A%20reputation_desc%2C%20first%3A%20%24first%2C%20offset%3A%20%24offset)%20%7B%0A%20%20%20%20name%0A%20%20%20%20reputation%0A%20%20%20%20__typename%0A%20%20%7D%0A%7D&operationName=usersByReputation&variables=%7B%0A%20%20%22first%22%3A%20100%2C%0A%20%20%22offset%22%3A%2010%0A%7D
//
// const usersByReputation = gql`
//   query usersByReputation($first: Int!, $offset: Int!) {
//     User(orderBy: reputation_desc, first: $first, offset: $offset) {
//       name
//       reputation
//     }
//   }
// `

const usersByReputation = gql`
  query usersByReputation {
    User(orderBy: reputation_desc, first: ${USERS_PER_PAGE}, offset: ${USERS_STARTING_OFFSET}) {
      name
      reputation
    }
  }
`


export default graphql(usersByReputation, {
  options: {
    // variables: {
    //   offset: USERS_STARTING_OFFSET,
    //   first: USERS_PER_PAGE
    // }
  },
  props: ({ data }) => ({
    data,
    loadMoreUsers: () => {
      return data.fetchMore({
        variables: {
          offset: USERS_STARTING_OFFSET + data.User.length
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult
          }
          return Object.assign({}, previousResult, {
            Users: [...previousResult.User, ...fetchMoreResult.User]
          })
        }
      })
    }
  })
})(ReputationLeaderboard)
