# Contributing to StakeHabit Web

Thank you for your interest in contributing to StakeHabit Web!

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/stakehabit-web.git
   cd stakehabit-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to set your API URL.

4. **Start development server**
   ```bash
   npm run dev
   ```

## Code Style

- Use TypeScript for all new code
- Follow existing component patterns in `src/components/` and `src/screens/`
- Use Tailwind CSS utility classes for styling
- Keep components focused and reusable
- Use the existing color variables from `index.css`:
  - `var(--bg)` - Background
  - `var(--surface)` - Surface/cards
  - `var(--rule)` - Borders
  - `var(--text)` - Primary text
  - `var(--text-muted)` - Secondary text
  - `var(--gold)` - Accent color
  - `var(--green)` - Success color
  - `var(--red)` - Error color

## Component Structure

### Components (`src/components/`)
Reusable UI components that can be used across multiple screens:
- Keep them stateless when possible
- Accept props for all dynamic data
- Export as default

### Screens (`src/screens/`)
Page-level components that represent full views:
- Can manage their own state
- Can use multiple components
- Handle navigation logic

## API Integration

All API calls should go through `src/lib/api.ts`:
- Use the existing `api` client instance
- Add new methods to the `ApiClient` class for new endpoints
- Handle errors appropriately with user-friendly messages
- Use the `Pool` and `Participant` types from `src/lib/poolStorage.ts`

## Adding New Features

1. **Create component/screen** in the appropriate directory
2. **Add route** to the `Screen` type in `App.tsx`
3. **Add navigation** logic in `App.tsx`
4. **Add API methods** in `src/lib/api.ts` if needed
5. **Test** the feature locally

## Testing

Before submitting a PR:
- Test on both dark and light themes
- Test on mobile viewport sizes
- Verify API integration works correctly
- Check for console errors

## Commit Messages

Use clear, descriptive commit messages:
```
feat: add pool search functionality
fix: correct pool join error handling
style: update button hover states
docs: update README with new features
```

## Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Questions?

Feel free to open an issue for clarification or discussion.
