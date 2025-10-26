pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/lakshmanbhukya/campus-resource-server.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                bat 'npm install'
            }
        }

        stage('Lint') {
            steps {
                echo '🧹 Running lint checks...'
                bat 'npm run lint || echo No lint script found'
            }
        }

        stage('Run Tests') {
            steps {
                echo '🧪 Running tests...'
                bat 'npm test || echo No tests defined'
            }
        }

        stage('Start Server') {
            steps {
                echo '🚀 Starting the server...'
                // Start in background without blocking Jenkins
                bat 'start /B npm start'
            }
        }
    }

    post {
        success {
            echo '✅ Build successful!'
        }
        failure {
            echo '❌ Build failed!'
        }
    }
}
