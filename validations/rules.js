module.exports = {
    users: {
        create: {
            name: {
                required: true,
                message: 'Name cannot be empty'
            },
            email: {
                required: true,
                type: 'email',
                message: 'Invalid email'
            },
            password: {
                required: true,
                min: 4,
                message: 'Invalid Password'
            }   
        },
        update: {
            name: {
                required: true,
                message: 'Name cannot be empty'
            },
            email: {
                required: true,
                type: 'email',
                message: 'Invalid email'
            },
            gender: {
                required: true,
                message: 'Must select a gender'
            }
        },
        login: {
            email: {
                required: true,
                type: 'email',
                message: 'Invalid email'
            },
            password: {
                required: true,
                message: 'Password cannot be empty'
            }
        },
    },

    books: {
        create: {
            genre: {
                required: true,
                message: 'Genre cannot be empty'
            },
            title: {
                required: true,
                message: 'Title cannot be empty'
            },
            author: {
                required: true,
                message: 'Author cannot be empty'
            },
        },
        request: {
            genre: {
                required: true,
                message: 'Genre cannot be empty'
            },
            title: {
                required: true,
                message: 'Title cannot be empty'
            },
            author: {
                required: true,
                message: 'Author cannot be empty'
            }
        }
    }
};
