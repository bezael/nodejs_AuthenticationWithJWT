const express = require('express');
const JWT = require('jsonwebtoken');
const app = express();
const PORT = 5000;

app.get('/api', (req, res)=>{
	res.json({
		message: 'Welcome to the API'
	});
});

app.post('/api/posts', verifyToken,(req, res)=>{

	let token = req.token;
	let secretKey = "secretKey";
	
	JWT.verify(token, secretKey, function(err, authData){
		 console.log(authData) // bar
		if(err){
			res.sendStatus(403);
		}else{
			res.json({
				message: 'Post Created.......',
				authData	
			});
		}
	});
});

app.post('/api/login', (req, res)=>{
	// Mock User
	const user = {
		id:1,
		username: 'testing',
		email: 'myemail@gmail.com'
	}

	JWT.sign({user: user}, 'secretKey', {expiresIn: '3h'}, (err, token) => {
		res.json({
			token:token
		});
	});
});

// FORMAT OF TOKEN

//Verify Token
function verifyToken(req, res, next){
	// get auth header value
	const bearerHeader = req.headers['authorization'];

	if (typeof(bearerHeader) !== 'undefined'){
		// Split at the space 
		const  bearer = bearerHeader.split(' ');
		// Get token from array 
		const bearerToken = bearer[1];
		// Set the token 
		req.token = bearerToken;
		// Next middleware 
		next();
	}else{
		// Forbidden
		res.sendStatus(403);
	}
}

app.listen(PORT, ()=>{
	console.log(`Server started on port ${PORT}`);
});
