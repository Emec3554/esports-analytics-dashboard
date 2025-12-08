// import React, { useState } from 'react';

// /**
//  * Visual Chart Debugger Component
//  * Shows what data is being passed to charts and helps diagnose issues
 
// const ChartDebugger = ({ analytics, projectedStats, chartData, appliedRecommendations, hasProjected }) => {
//   const [isExpanded, setIsExpanded] = useState(true);

//   const statusColor = (condition) => condition ? '#10b981' : '#ef4444';
//   const statusText = (condition) => condition ? '✓ OK' : '✗ MISSING';

//   return (
//     <div style={{
//       position: 'fixed',
//       bottom: '20px',
//       right: '20px',
//       width: '400px',
//       maxHeight: '80vh',
//       background: 'white',
//       borderRadius: '12px',
//       boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
//       zIndex: 9999,
//       overflow: 'hidden',
//       border: '3px solid #3b82f6'
//     }}>
//       {/* Header */}
//       <div style={{
//         background: '#3b82f6',
//         color: 'white',
//         padding: '12px 16px',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         cursor: 'pointer'
//       }} onClick={() => setIsExpanded(!isExpanded)}>
//         <strong>🔍 Chart Debugger</strong>
//         <button style={{
//           background: 'transparent',
//           border: 'none',
//           color: 'white',
//           fontSize: '18px',
//           cursor: 'pointer'
//         }}>
//           {isExpanded ? '▼' : '▲'}
//         </button>
//       </div>

//       {isExpanded && (
//         <div style={{ padding: '16px', maxHeight: '70vh', overflow: 'auto' }}>
//           {/* Status Checks */}
//           <div style={{ marginBottom: '16px' }}>
//             <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#374151' }}>
//               Data Status
//             </h3>
            
//             <div style={{ fontSize: '13px', marginBottom: '8px' }}>
//               <span style={{ color: statusColor(!!analytics) }}>
//                 {statusText(!!analytics)}
//               </span>
//               <span style={{ marginLeft: '8px', color: '#6b7280' }}>Analytics Data</span>
//             </div>

//             <div style={{ fontSize: '13px', marginBottom: '8px' }}>
//               <span style={{ color: statusColor(!!analytics?.kda) }}>
//                 {statusText(!!analytics?.kda)}
//               </span>
//               <span style={{ marginLeft: '8px', color: '#6b7280' }}>KDA Data</span>
//             </div>

//             <div style={{ fontSize: '13px', marginBottom: '8px' }}>
//               <span style={{ color: statusColor(!!analytics?.winRate) }}>
//                 {statusText(!!analytics?.winRate)}
//               </span>
//               <span style={{ marginLeft: '8px', color: '#6b7280' }}>Win Rate Data</span>
//             </div>

//             <div style={{ fontSize: '13px', marginBottom: '8px' }}>
//               <span style={{ color: statusColor(!!chartData) }}>
//                 {statusText(!!chartData)}
//               </span>
//               <span style={{ marginLeft: '8px', color: '#6b7280' }}>Chart Data</span>
//             </div>

//             <div style={{ fontSize: '13px', marginBottom: '8px' }}>
//               <span style={{ color: statusColor(hasProjected) }}>
//                 {hasProjected ? '✓ YES' : '✗ NO'}
//               </span>
//               <span style={{ marginLeft: '8px', color: '#6b7280' }}>Has Projected Stats</span>
//             </div>

//             <div style={{ fontSize: '13px', marginBottom: '8px' }}>
//               <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>
//                 {appliedRecommendations?.length || 0}
//               </span>
//               <span style={{ marginLeft: '8px', color: '#6b7280' }}>Applied Recommendations</span>
//             </div>
//           </div>

//           {/* Analytics Preview */}
//           {analytics && (
//             <div style={{ marginBottom: '16px' }}>
//               <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>
//                 Current Stats
//               </h3>
//               <div style={{ 
//                 background: '#f3f4f6', 
//                 padding: '12px', 
//                 borderRadius: '6px',
//                 fontSize: '12px',
//                 fontFamily: 'monospace'
//               }}>
//                 <div>Kills: {analytics.kda?.avgKills}</div>
//                 <div>Deaths: {analytics.kda?.avgDeaths}</div>
//                 <div>Assists: {analytics.kda?.avgAssists}</div>
//                 <div>KDA: {analytics.kda?.kdaRatio}</div>
//                 <div>Win Rate: {analytics.winRate?.winRate}%</div>
//                 {analytics.farm && (
//                   <>
//                     <div>GPM: {analytics.farm?.avgGPM}</div>
//                     <div>Last Hits: {analytics.farm?.avgLastHits}</div>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Projected Stats Preview */}
//           {projectedStats && (
//             <div style={{ marginBottom: '16px' }}>
//               <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>
//                 Projected Stats
//               </h3>
//               <div style={{ 
//                 background: '#d1fae5', 
//                 padding: '12px', 
//                 borderRadius: '6px',
//                 fontSize: '12px',
//                 fontFamily: 'monospace'
//               }}>
//                 <div>Kills: {projectedStats.kda?.avgKills}</div>
//                 <div>Deaths: {projectedStats.kda?.avgDeaths}</div>
//                 <div>Assists: {projectedStats.kda?.avgAssists}</div>
//                 <div>KDA: {projectedStats.kda?.kdaRatio}</div>
//                 <div>Win Rate: {projectedStats.winRate?.winRate}%</div>
//                 {projectedStats.farm && (
//                   <>
//                     <div>GPM: {projectedStats.farm?.avgGPM}</div>
//                     <div>Last Hits: {projectedStats.farm?.avgLastHits}</div>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Chart Data Preview */}
//           {chartData && (
//             <div style={{ marginBottom: '16px' }}>
//               <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>
//                 Chart Data Arrays
//               </h3>
//               <div style={{ fontSize: '12px' }}>
//                 <div style={{ marginBottom: '4px' }}>
//                   <span style={{ color: statusColor(chartData.kdaBarData?.length > 0) }}>
//                     {chartData.kdaBarData?.length || 0}
//                   </span>
//                   <span style={{ marginLeft: '8px' }}>KDA Bar Items</span>
//                 </div>
//                 <div style={{ marginBottom: '4px' }}>
//                   <span style={{ color: statusColor(chartData.kdaRatioData?.length > 0) }}>
//                     {chartData.kdaRatioData?.length || 0}
//                   </span>
//                   <span style={{ marginLeft: '8px' }}>KDA Ratio Items</span>
//                 </div>
//                 <div style={{ marginBottom: '4px' }}>
//                   <span style={{ color: statusColor(chartData.winRateData?.length > 0) }}>
//                     {chartData.winRateData?.length || 0}
//                   </span>
//                   <span style={{ marginLeft: '8px' }}>Win Rate Items</span>
//                 </div>
//                 {chartData.farmData && (
//                   <div style={{ marginBottom: '4px' }}>
//                     <span style={{ color: statusColor(chartData.farmData?.length > 0) }}>
//                       {chartData.farmData?.length || 0}
//                     </span>
//                     <span style={{ marginLeft: '8px' }}>Farm Data Items</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Raw Data */}
//           <details style={{ marginTop: '16px' }}>
//             <summary style={{ 
//               cursor: 'pointer', 
//               padding: '8px',
//               background: '#f3f4f6',
//               borderRadius: '6px',
//               marginBottom: '8px',
//               fontSize: '13px',
//               fontWeight: '600'
//             }}>
//               View Raw Chart Data
//             </summary>
//             <pre style={{ 
//               background: '#1f2937',
//               color: '#10b981',
//               padding: '12px',
//               borderRadius: '6px',
//               fontSize: '10px',
//               overflow: 'auto',
//               maxHeight: '200px'
//             }}>
//               {JSON.stringify(chartData, null, 2)}
//             </pre>
//           </details>

//           {/* Instructions */}
//           <div style={{
//             marginTop: '16px',
//             padding: '12px',
//             background: '#fef3c7',
//             borderRadius: '6px',
//             fontSize: '12px',
//             color: '#92400e'
//           }}>
//             <strong>Debug Tips:</strong>
//             <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
//               <li>Check if all ✓ OK indicators are green</li>
//               <li>Apply recommendations to see projected stats</li>
//               <li>Check browser console (F12) for errors</li>
//               <li>Verify Recharts is installed</li>
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChartDebugger;

// */