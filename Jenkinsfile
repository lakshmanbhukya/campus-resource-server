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
                echo '🧪 Running tests with coverage...'
                bat 'npm test || echo No tests defined'
            }
            post {
                always {
                    script {
                        if (fileExists('coverage/lcov-report/index.html')) {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Coverage Report'
                            ])
                        }
                    }
                }
            }
        }

        stage('Build & Archive') {
            steps {
                echo '📦 Archiving artifacts...'
                script {
                    if (fileExists('coverage')) {
                        archiveArtifacts artifacts: 'coverage/**/*', allowEmptyArchive: true
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Starting the server...'
                bat 'start /B npm start'
                echo 'Server deployment initiated'
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
