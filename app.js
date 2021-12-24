const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');
const cors = require('cors');

const GerenciadorUsuarios = require('./servicos/GerenciadorUsuarios');

// Carrega os arquivos de configuração (dev)
if (!isProducao()) {
    dotenv.config({ path: './config/config.env' });
}

// Configurações de login
require('./config/local_passport')(passport);

async function conectaBancoDedados() {
    await connectDB();
    GerenciadorUsuarios.criaUsuarioAdministrador();
}

conectaBancoDedados();

const app = express();

// redirecionamento para https na UMBLER
if (isProducao()) {
    // https://help.umbler.com/hc/pt-br/articles/115001793863#redirectNode
    app.use((req, res, next) => { //Cria um middleware onde todas as requests passam por ele 
        if ((req.headers["x-forwarded-proto"] || "").endsWith("http")) //Checa se o protocolo informado nos headers é HTTP 
            res.redirect(`https://${req.headers.host}${req.url}`); //Redireciona pra HTTPS 
        else //Se a requisição já é HTTPS 
            next(); //Não precisa redirecionar, passa para os próximos middlewares que servirão com o conteúdo desejado 
    });
} else {
    app.use(cors());
}

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(
    methodOverride(function(req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            let method = req.body._method;
            delete req.body._method;
            return method;
        }
    })
)

// Logging
if (!isProducao()) {
    app.use(morgan('dev'));
}

// Handlebars Helpers
const {
    formatDate,
    checked,
    stripTags,
    truncate,
    editIcon,
    select,
} = require('./helpers/hbs');

// Handlebars
app.engine(
    '.hbs',
    exphbs({
        helpers: {
            formatDate,
            checked,
            stripTags,
            truncate,
            editIcon,
            select,
        },
        defaultLayout: 'main',
        extname: '.hbs',
    })
)
app.set('view engine', '.hbs')

// Sessions
app.use(
    session({
        secret: 'educatools',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
)

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use(function(req, res, next) {
    res.locals.user = req.user || null;
    next();
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/ferramentas', require('./routes/ferramentas'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/usuarios', require('./routes/usuarios'));
app.use('/validacao', require('./routes/validacao'));
app.use('/favoritos', require('./routes/favoritos'));
app.use('/grupos', require('./routes/grupos'));
app.use('/estatisticas', require('./routes/estatisticas'));

const PORT = process.env.PORT || 3000;
app.listen(
    PORT,
    console.log(`SERVIDOR FUNCIONANDO. MODO: ${process.env.NODE_ENV} || PORTA: ${PORT}`)
)

function isProducao() {
    return process.env.NODE_ENV === 'production';
}