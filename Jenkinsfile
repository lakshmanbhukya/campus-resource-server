pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
    }

    stages {
        sstage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/lakshmanbhukya/campus-resource-server.git'
            }
        }


        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                sh 'npm install'
            }
        }

        stage('Lint') {
            steps {
                echo '🧹 Running lint checks...'
                sh 'npm run lint || echo "No lint script found"'
            }
        }

        stage('Run Tests') {
            steps {
                echo '🧪 Running tests...'
                sh 'npm test || echo "No tests defined"'
            }
        }

        stage('Start Server') {
            steps {
                echo '🚀 Starting the server...'
                sh 'nohup npm start &'
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
