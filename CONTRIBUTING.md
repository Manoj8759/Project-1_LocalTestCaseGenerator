# Contributing to Local LLM Test Case Generator

First off, thank you for considering contributing to this project! It's people like you that make this tool better for everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. Please be kind, respectful, and constructive in all interactions.

---

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Environment details** (OS, Node.js version, Ollama version)
- **Screenshots** if applicable
- **Error messages or logs**

### Suggesting Enhancements

Enhancement suggestions are welcome! Please include:

- **Clear use case** - Why is this enhancement useful?
- **Detailed description** of the proposed functionality
- **Possible implementation approach** (if you have ideas)
- **Alternative solutions** you've considered

### Contributing Code

We love code contributions! Areas where you can help:

- 🐛 **Bug fixes**
- ✨ **New features** from the roadmap
- 📝 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- ⚡ **Performance optimizations**
- 🧪 **Test coverage**

---

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (v18+)
2. **Git**
3. **Ollama** with llama3.2 model
4. A **GitHub account**

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Project-1_LocalTestCaseGenerator.git
   cd Project-1_LocalTestCaseGenerator
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/manoj8759/Project-1_LocalTestCaseGenerator.git
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the development server:
   ```bash
   node server.js
   ```

---

## 💻 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `style/` - UI/CSS changes
- `test/` - Adding tests

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Comment complex logic
- Test your changes thoroughly

### 3. Test Your Changes

Before committing:

1. **Manual testing:**
   - Start the server: `node server.js`
   - Test in browser: http://localhost:3000
   - Generate multiple test cases
   - Check error handling

2. **Verify Ollama integration:**
   - Test with different prompts
   - Check edge cases
   - Verify error messages

### 4. Commit Your Changes

```bash
git add .
git commit -m "type: brief description"
```

See [Commit Messages](#commit-messages) section for guidelines.

### 5. Keep Your Fork Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

---

## 🎨 Style Guidelines

### JavaScript Style

- Use **ES6+** syntax
- Use `const` and `let`, avoid `var`
- Use **arrow functions** where appropriate
- Use **async/await** for asynchronous code
- Add **JSDoc comments** for functions:
  ```javascript
  /**
   * Generate test cases from user input
   * @param {string} input - User requirement
   * @returns {Promise<string>} Generated test cases
   */
  async function generateTestCases(input) { ... }
  ```

### CSS Style

- Follow existing naming conventions
- Use **CSS custom properties** (variables) for colors and spacing
- Keep styles modular and reusable
- Mobile-first responsive design
- Comment complex CSS logic

### File Organization

- Backend logic stays in `server.js`
- Frontend files in `public/` directory
- Documentation in root or `docs/` folder
- Keep files focused and single-purpose

---

## 📝 Commit Messages

Follow the **Conventional Commits** specification:

```
<type>: <description>

[optional body]

[optional footer]
```

### Types:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Examples:

```bash
feat: Add support for JSON export format
fix: Resolve Ollama connection timeout issue
docs: Update installation instructions for Windows
style: Improve dark mode color contrast
refactor: Extract prompt logic into separate module
```

---

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Self-review of your code completed
- [ ] Commented complex or non-obvious code
- [ ] Documentation updated (if needed)
- [ ] No new warnings or errors introduced
- [ ] Tested on localhost successfully

### Submitting the PR

1. **Push your branch** to your fork
2. **Open a Pull Request** against `main` branch
3. **Fill out the PR template** with:
   - Clear description of changes
   - Related issue numbers (if applicable)
   - Screenshots/GIFs (for UI changes)
   - Testing steps

4. **Wait for review**
   - Maintainers will review your code
   - Address any feedback or requested changes
   - Keep the conversation constructive

### PR Title Format

Use the same format as commit messages:
```
feat: Add CSV export functionality
fix: Correct test case ID numbering
```

---

## 🏗️ B.L.A.S.T. Protocol Compliance

This project follows the **B.L.A.S.T. protocol**. When contributing:

- **Blueprint**: Update `gemini.md` if data schemas change
- **Link**: Verify external connections still work
- **Architect**: Maintain separation between layers
- **Stylize**: Keep UI professional and premium
- **Trigger**: Document deployment implications

See [BLAST.md](BLAST.md) for full details.

---

## 🐛 Debugging Tips

### Server Issues

```bash
# Check Node.js version
node --version

# Verify dependencies
npm list

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Ollama Issues

```bash
# Check Ollama status
ollama list

# Test model directly
ollama run llama3.2 "Hello"

# Pull model again if needed
ollama pull llama3.2
```

---

## 📚 Additional Resources

- [Ollama Documentation](https://ollama.ai/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

## ❓ Questions?

If you have questions about contributing:

- Open a **Discussion** on GitHub
- Tag your issue with `question` label
- Reach out to [@manoj8759](https://github.com/manoj8759)

---

## 🙏 Thank You!

Your contributions make this project better for everyone. Whether it's code, documentation, bug reports, or feature ideas – every contribution is valued and appreciated!

**Happy coding!** 🚀
