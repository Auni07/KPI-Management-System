//run node migrateFeedback.js to update feedback in mongodb from String to Array
//this file can be deleted once everyone completed their migration
const mongoose = require('mongoose');
const Kpi = require('./models/kpi'); // Adjust path if needed

async function migrateFeedback() {
  try {
    await mongoose.connect('mongodb://localhost:27017/kpi_system');

    // Find all KPIs where feedback is a string (legacy format)
    const kpisWithStringFeedback = await Kpi.find({ feedback: { $type: "string" } });

    console.log(`Found ${kpisWithStringFeedback.length} KPIs with string feedback.`);

    for (const kpi of kpisWithStringFeedback) {
    let currentFeedback = kpi.feedback;

    if (Array.isArray(currentFeedback)) {
        currentFeedback = currentFeedback.length > 0 ? String(currentFeedback[0]) : "";
    } else if (typeof currentFeedback !== "string") {
        currentFeedback = String(currentFeedback);
    }

    kpi.feedback = [{
        text: currentFeedback,
        date: new Date(),
    }];

    await kpi.save();
    console.log(`Migrated KPI ${kpi._id}`);
    }

    console.log('Migration completed!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Migration error:', err);
  }
}

migrateFeedback();