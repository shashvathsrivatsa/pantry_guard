// ── Pantry data ────────────────────────────────────────────────────────────
// window.PANTRY = [
//     {
//         id:'boarshead', cat:'recalled', emoji:'🥩', name:"Boar's Head Turkey Breast", meta:'Added Jun 12 · Exp Jun 20',
//         tag:'RECALLED', tagClass:'tag-recalled', itemClass:'recalled',
//         alertId:'alert-boarshead',
//         detail:{
//             statusType:'recalled',
//             statusTitle:'⚠ ACTIVE FDA RECALL',
//             statusDesc:"This product matches FDA recall #2024-0612 (Listeria monocytogenes). Do not consume — dispose of immediately or return to store for a full refund.",
//             why:"Boar's Head deli products produced at the Jarratt, VA facility have tested positive for Listeria monocytogenes. Listeria is a serious infection risk — particularly dangerous for pregnant women, elderly, and immunocompromised individuals. The CDC has linked this outbreak to multiple hospitalizations.",
//             flags:[
//                 {label:'Class I Recall', type:'bad'},
//                 {label:'Listeria monocytogenes', type:'bad'},
//                 {label:'EST. 12612 label', type:'warn'},
//                 {label:'Dispose immediately', type:'bad'}
//             ]
//         }
//     },
//     {
//         id:'milk', cat:'recalled', emoji:'🥛', name:'Whole Milk 1 Gallon', meta:'Added Jun 14 · Exp Jun 25',
//         tag:'RECALLED', tagClass:'tag-recalled', itemClass:'recalled',
//         alertId:'alert-boarshead',
//         detail:{
//             statusType:'recalled',
//             statusTitle:'⚠ ACTIVE FDA RECALL',
//             statusDesc:"This lot matches an active FDA dairy recall. Do not consume. Return to point of purchase for a full refund.",
//             why:"Contamination detected during routine FDA testing at the bottling facility. Lot codes affected: 2406A–2406D. The contamination involves undeclared allergen cross-contact during production line changeover.",
//             flags:[
//                 {label:'Class II Recall', type:'bad'},
//                 {label:'Allergen cross-contact', type:'bad'},
//                 {label:'Lot 2406A-D affected', type:'warn'}
//             ]
//         }
//     }
// ];

// Start empty; items are added from receipt scans
window.PANTRY = [];
