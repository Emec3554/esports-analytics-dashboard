# Dynamic Recommendations System

## Overview
The Dynamic Recommendations System analyzes player performance using live OpenDota API data and generates personalized, actionable improvement suggestions based on real match statistics.

## Features

### 1. **Live Data Analysis**
- Fetches real player matches from OpenDota API
- Analyzes 20-50 recent matches
- Calculates comprehensive performance metrics

### 2. **Smart Recommendations Engine**
- **Priority-based suggestions**: CRITICAL, HIGH, MEDIUM, LOW
- **Role-aware analysis**: Different benchmarks for Carry, Midlane, Offlane, Support, Hard Support
- **Category-based organization**: Positioning, Farm Efficiency, Map Awareness, Team Coordination, Hero Mastery, Mechanics, Itemization

### 3. **Performance Scoring**
- Overall performance score (0-100)
- Letter grades: S, A, B, C, D, F
- Comparison against role-specific benchmarks

### 4. **Progress Tracking**
- Save baseline statistics
- Track improvements over time
- Compare "before" vs "after" metrics

## Architecture

### File Structure
```
src/
├── services/
│   ├── analytics.service.js       # Core analytics engine
│   └── recommendations.engine.js  # Recommendation generation
├── hooks/
│   ├── usePlayerAnalytics.js      # Analytics data fetching
│   └── useRecommendations.js      # Recommendation management
├── utils/
│   ├── statsCalculator.js         # Statistical calculations
│   └── performanceMetrics.js      # Benchmarks and scoring
└── pages/
    └── DynamicRecommendations.js  # Main UI component
```

## How It Works

### 1. Data Collection
```javascript
const analytics = await analyzePlayerPerformance(accountId, 30);
```
Fetches and processes:
- KDA (Kills/Deaths/Assists)
- Farm efficiency (GPM, XPM, Last Hits)
- Death analysis (early/mid/late game)
- Teamfight impact (damage, healing)
- Hero pool analysis
- Win rate statistics

### 2. Recommendation Generation
```javascript
const recommendations = generateDynamicRecommendations(analytics);
```

The engine identifies weaknesses by comparing player stats against role-specific benchmarks:
- **High Deaths** → Positioning recommendations
- **Low KDA** → Team coordination suggestions
- **Poor Farm** → Farm efficiency tips
- **Low Win Rate** → Strategic gameplay advice
- **Weak Hero Performance** → Hero mastery guidance

### 3. Actionable Steps
Each recommendation includes:
- **Title**: Clear problem statement
- **Issue**: Specific metric causing concern
- **Recommendation**: High-level solution
- **Actionable Steps**: 4-6 specific actions to take
- **Expected Impact**: Predicted improvement in stats
- **Current vs Target**: Visual metric comparison

## Example Recommendations

### Critical Priority: High Death Count
**Issue**: Average 8.2 deaths per game
**Recommendation**: Focus on map awareness and positioning

**Action Steps**:
1. Look at minimap every 3-5 seconds
2. Stay behind your team's frontline
3. Buy Observer Wards to track enemy movements
4. Avoid farming without vision of enemy cores

**Expected Impact**:
- Deaths: -2.0
- Win Rate: +5%
- KDA Ratio: +0.5

---

### High Priority: Low Farm Efficiency
**Issue**: 380 GPM (target: 450+)
**Recommendation**: Improve last-hitting and jungle farming patterns

**Action Steps**:
1. Practice last-hitting in demo mode
2. Stack jungle camps before farming them
3. Farm jungle between lane waves
4. Use abilities to farm faster
5. Push out waves then farm jungle

**Expected Impact**:
- GPM: +80
- Net Worth: +2500
- Win Rate: +7%

## Usage

### From Player Profile
```javascript
// Player visits any player profile
// Click "View Recommendations" button
// System analyzes last 30 matches
// Displays personalized recommendations
```

### Direct Access
```
/recommendations/:accountId
```

### UI Components

#### Performance Score Card
- Overall grade (S, A, B, C, D, F)
- Numerical score (0-100)
- Key metrics breakdown
- Role identification

#### Recommendation Cards
- Priority badge (color-coded)
- Category tag
- Problem description
- Action steps list
- Metric comparison
- Expected impact tags
- Apply/Applied toggle

#### Progress Tracking
- Baseline saving
- Improvement comparison
- Visual delta indicators

## API Integration

### OpenDota Endpoints Used
```javascript
// Player matches
GET /players/{account_id}/matches?limit=30

// Player win/loss
GET /players/{account_id}/wl

// Hero constants
GET /constants/heroes
```

## Customization

### Adjusting Benchmarks
Edit `src/utils/performanceMetrics.js`:
```javascript
export const ROLE_BENCHMARKS = {
  'Carry': {
    avgGPM: 550,
    targetKDA: 3.0,
    targetDeaths: 5
  },
  // ... other roles
};
```

### Adding New Recommendation Rules
Edit `src/services/recommendations.engine.js`:
```javascript
// Add new analysis logic
if (condition) {
  recommendations.push({
    id: 'unique-id',
    category: RECOMMENDATION_CATEGORIES.YOUR_CATEGORY,
    priority: 'HIGH',
    title: 'Your Title',
    issue: 'Problem description',
    recommendation: 'Solution',
    actionableSteps: ['Step 1', 'Step 2'],
    expectedImpact: { metric: value }
  });
}
```

## Performance Considerations

### Caching
- Recommendations are recalculated on page load
- Applied recommendations saved to localStorage
- Progress baselines stored locally

### Rate Limiting
- OpenDota API has rate limits
- Consider implementing request caching
- Add retry logic for failed requests

## Future Enhancements

### Planned Features
1. **Machine Learning Integration**
   - Pattern recognition for common mistakes
   - Predictive win probability
   - Hero counter recommendations

2. **Community Insights**
   - Compare to players at similar MMR
   - Trending strategies
   - Meta analysis

3. **Video Analysis**
   - Link to replay timestamps
   - Pro player comparison clips
   - Tutorial video suggestions

4. **Team Analysis**
   - Squad composition recommendations
   - Role synergy analysis
   - Draft phase insights

5. **Real-time Coaching**
   - In-game overlay suggestions
   - Live performance tracking
   - Post-match immediate feedback

## Troubleshooting

### No Recommendations Generated
- Player may have insufficient match history (< 20 matches)
- Performance may be excellent (no issues detected)
- API rate limit may be reached

### Incorrect Role Detection
- System uses GPM/XPM/CS to detect role
- May misclassify flexible players
- Manual role selection coming in future update

### Slow Loading
- OpenDota API can be slow during peak hours
- Consider reducing match count
- Implement loading states and timeouts

## Contributing

To add new recommendation types:
1. Identify the performance metric
2. Add calculation logic to `statsCalculator.js`
3. Add recommendation rules to `recommendations.engine.js`
4. Update benchmarks in `performanceMetrics.js`
5. Test with various player profiles

## License
Part of the Esports Analytics Dashboard project.
