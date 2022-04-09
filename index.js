const { ApolloServer, gql } = require('apollo-server');
const fetch = require("node-fetch");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
	type Weather {
		temperature: Float
	}

	type Query {
		weather: Weather
	}
`;

const resolvers = {
	Query: {
		weather: () => {
			const options = {
				method: 'GET',
				headers: {
					'X-RapidAPI-Host': 'community-open-weather-map.p.rapidapi.com',
					'X-RapidAPI-Key': '88a5b40caemsh86e4a6f7a0d06efp10c6a0jsn7057d67781d9'
				}
			};
			
			const parseResponse = (response) => {
				return {
					temperature: response.main.temp,
				}
			}

			return fetch('https://community-open-weather-map.p.rapidapi.com/weather?q=Los%20Angeles%2C%20US&lat=0&lon=0&id=2172797&lang=null&units=imperial&mode=json', options)
				.then(response => response.json())
				.then(response => parseResponse(response))
				.catch(err => console.error(err));
		},
	},
};

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});