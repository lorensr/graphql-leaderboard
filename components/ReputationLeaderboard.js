import { gql, graphql } from 'react-apollo'

// https://twitter.com/lorendsr/status/865693795601592320
const USERS_STARTING_OFFSET = 12945

const USERS_PER_PAGE = 100

function ReputationLeaderboard ({ data: { User, loading, networkStatus }, loadMoreUsers }) {
  console.log('render', User && User.length, loading, networkStatus)
  if (User && User.length) {
    return (
      <section>
        <h1>GraphQL Community Reputation Leaderboard</h1>
        <table>
          <tbody>
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
          </tbody>
        </table>
        <button onClick={() => loadMoreUsers()}>
          {loading ? 'Loading...' : 'Show More'}
        </button>

        <style jsx>{`
          section {
            padding-bottom: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          span {
            font-size: 14px;
            margin-right: 5px;
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
          table {
            margin-bottom: 20px;
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

const usersByReputation = gql`
  query usersByReputation($first: Int!, $offset: Int!) {
    User(orderBy: reputation_desc, first: $first, offset: $offset) {
      name
      reputation
    }
  }
`

export default graphql(usersByReputation, {
  options: {
    variables: {
      offset: USERS_STARTING_OFFSET,
      first: USERS_PER_PAGE
    },
    notifyOnNetworkStatusChange: true
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
          const updatedResult = Object.assign({}, previousResult, {
            User: [...previousResult.User, ...fetchMoreResult.User]
          })
          return updatedResult
        }
      })
    }
  })
})(ReputationLeaderboard)
