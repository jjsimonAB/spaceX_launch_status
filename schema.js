const { GraphQLObjectType, 
        GraphQLInt, 
        GraphQLString, 
        GraphQLBoolean,
        GraphQLList,
        GraphQLSchema,
} = require('graphql');

const authController = require('./constrollers/auth');

const axios = require('axios');

// Lunch Type

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: { type: GraphQLString},
        name: { type: GraphQLString },
        email: { type: GraphQLString},
        password: {type: GraphQLString},
        status: {type: GraphQLString}
    })
})

const LaunchType = new GraphQLObjectType({
    name: 'Launch',
    fields: () => ({
        flight_number: { type: GraphQLInt },
        mission_name: { type: GraphQLString },
        launch_year: { type: GraphQLString },
        launch_date_local: { type: GraphQLString },
        launch_success: { type: GraphQLBoolean },
        rocket: { type: RocketType },

    })
});

const RocketType = new GraphQLObjectType({
    name: 'Rocket',
    fields: () => ({
        rocket_id: { type: GraphQLString },
        rocket_name: { type: GraphQLString },
        rocket_type: { type: GraphQLString }
    })
});

//Root Query

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        launches: {
            type: new GraphQLList(LaunchType),
            resolve(parent, args) {
                return axios.get('https://api.spacexdata.com/v3/launches')
                    .then(res => res.data);
            }
        },
        launch: {
            type: LaunchType,
            args: {
              flight_number: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return axios.get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`)
                    .then(res => res.data);
            }  
        },
        rockets: {
            type: new GraphQLList(RocketType),
            resolve(parent, args) {
                return axios.get('https://api.spacexdata.com/v3/rockets')
                    .then(res => res.data);
            }
        },
        rocket: {
            type: RocketType,
            args: {
              id: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return axios.get(`https://api.spacexdata.com/v3/rockets/${args.id}`)
                    .then(res => res.data);
            }  
        },
        register: {
            type: UserType,
            args: {
                name: { type: GraphQLString},
                email: { type: GraphQLString},
                password: { type: GraphQLString},
                password2: { type: GraphQLString}
            },
            resolve(parent, args){
                let status = {
                    status: ''
                };

                if(authController.register({...args})){
                    status.status = 'success'
                }else {
                    status.status = 'failure';
                }

                return status; 
            }
        },
        login: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parent, args){
                let status = {
                    status: ''
                }

                if(authController.login({...args})){
                    status.status = 'success';
                }else {
                    status.status = 'failure';
                }

                return status;
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})