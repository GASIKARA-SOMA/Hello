require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// CONFIGURATION DU SITE
let siteConfig = {
  message: "🌍 Hello Gasikara !",
  color: "#2c5aa0", 
  backgroundColor: "#f0f8ff"
};

// PAGE PRINCIPALE
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Hello Gasikara</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          margin: 100px;
          background: ${siteConfig.backgroundColor};
          transition: background 0.5s;
        }
        h1 {
          color: ${siteConfig.color};
          font-size: 48px;
        }
        .admin-btn {
          background: #ff6b6b;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin: 20px;
          font-size: 16px;
        }
        .admin-btn:hover {
          background: #ff5252;
        }
      </style>
    </head>
    <body>
      <h1>${siteConfig.message}</h1>
      <p>Bienvenue sur le site le plus sécurisé du Rwanda ! 🔒</p>
      
      <button class="admin-btn" onclick="openAdmin()">
        🔐 Accès Admin
      </button>
      
      <script>
        function openAdmin() {
          const password = prompt("🔒 Mot de passe admin :");
          if (password) {
            fetch('/admin/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password: password })
            })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                alert('✅ Connexion réussie !');
                window.location.href = '/admin';
              } else {
                alert('❌ Mot de passe incorrect');
              }
            })
            .catch(error => {
              alert('💥 Erreur de connexion');
            });
          }
        }
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

// CONNEXION ADMIN SIMPLE
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();

app.use(express.json());

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD || "$2a$10$d2rYXn4Y3pY3pY3pY3pY3uY3pY3pY3pY3pY3pY3pY3pY3pY3pY3pY";

// CONFIGURATION DU SITE
let siteConfig = {
  message: "🌍 Hello Gasikara !",
  color: "#2c5aa0", 
  backgroundColor: "#f0f8ff"
};

// CONNEXION ADMIN SÉCURISÉE
app.post('/admin/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.json({ success: false, error: "Mot de passe requis" });
    }

    // VÉRIFICATION AVEC HASH
    const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    
    if (isValid) {
      res.json({ 
        success: true, 
        message: "Connexion admin réussie !" 
      });
    } else {
      res.json({ 
        success: false, 
        error: "Mot de passe incorrect" 
      });
    }
  } catch (error) {
    res.json({ 
      success: false, 
      error: "Erreur de connexion" 
    });
  }
});

// ... (le reste de ton code reste identique)
// PAGE ADMIN
app.get('/admin', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Admin - Hello Gasikara</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 40px;
          background: #f8f9fa;
        }
        .admin-container {
          max-width: 600px;
          margin: 0 auto;
        }
        .config-form { 
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .form-group {
          margin: 20px 0;
        }
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          color: #333;
        }
        input, textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
        }
        input[type="color"] {
          height: 50px;
          padding: 5px;
        }
        button {
          background: #2c5aa0;
          color: white;
          padding: 15px 30px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          width: 100%;
        }
        button:hover {
          background: #1e3d6f;
        }
        .logout-btn {
          background: #dc3545;
          margin-top: 10px;
        }
        .logout-btn:hover {
          background: #c82333;
        }
      </style>
    </head>
    <body>
      <div class="admin-container">
        <h1>🔐 Administration Hello Gasikara</h1>
        <p>Bienvenue dans l'espace d'administration</p>
        
        <div class="config-form">
          <h2>🎨 Personnalisation du site</h2>
          <form id="configForm">
            <div class="form-group">
              <label>Message de bienvenue :</label>
              <input type="text" name="message" value="${siteConfig.message}" required>
            </div>
            
            <div class="form-group">
              <label>Couleur du texte :</label>
              <input type="color" name="color" value="${siteConfig.color}">
            </div>
            
            <div class="form-group">
              <label>Couleur de fond :</label>
              <input type="color" name="backgroundColor" value="${siteConfig.backgroundColor}">
            </div>
            
            <button type="submit">💾 Sauvegarder les modifications</button>
          </form>
          
          <button class="logout-btn" onclick="logout()">🚪 Déconnexion</button>
        </div>
      </div>
      
      <script>
        document.getElementById('configForm').addEventListener('submit', function(e) {
          e.preventDefault();
          const formData = new FormData(this);
          const data = Object.fromEntries(formData);
          
          fetch('/admin/update-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then(result => {
            if (result.success) {
              alert('✅ Configuration sauvegardée avec succès !');
              setTimeout(() => {
                window.location.href = '/';
              }, 1000);
            } else {
              alert('❌ Erreur: ' + result.error);
            }
          })
          .catch(error => {
            alert('💥 Erreur de connexion');
          });
        });
        
        function logout() {
          if (confirm('Se déconnecter ?')) {
            window.location.href = '/';
          }
        }
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

// METTRE À JOUR LA CONFIGURATION
app.post('/admin/update-config', (req, res) => {
  try {
    const { message, color, backgroundColor } = req.body;
    
    // Validation basique
    if (!message || !color || !backgroundColor) {
      return res.json({ success: false, error: "Tous les champs sont requis" });
    }
    
    siteConfig = {
      message: message.trim(),
      color: color,
      backgroundColor: backgroundColor
    };
    
    res.json({ 
      success: true, 
      message: "Configuration mise à jour avec succès !" 
    });
  } catch (error) {
    res.json({ 
      success: false, 
      error: "Erreur lors de la mise à jour" 
    });
  }
});

// DÉMARRAGE DU SERVEUR
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur Hello Gasikara démarré sur le port ${PORT}`);
  console.log(`🔐 Mot de passe admin: "123"`);
  console.log(`🌍 Site accessible: http://localhost:${PORT}`);
});
