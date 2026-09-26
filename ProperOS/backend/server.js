const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuration for Obsidian Vault
const OBSIDIAN_VAULT_PATH = 'C:/Users/jsmit/Documents/ProperAI_Vault'; // Adjust this to actual Obsidian Vault path
const KB_DIR = path.join(OBSIDIAN_VAULT_PATH, 'MasterKnowledgeBase');

// Ensure Obsidian Vault directories exist
if (!fs.existsSync(OBSIDIAN_VAULT_PATH)) fs.mkdirSync(OBSIDIAN_VAULT_PATH, { recursive: true });
if (!fs.existsSync(KB_DIR)) fs.mkdirSync(KB_DIR, { recursive: true });

app.use(cors());
app.use(bodyParser.json());

let systemState = {
    projects: [],
    agents: {
        viral: { status: 'Idle', kbVersion: 'v4.0', lastUpdated: new Date().toISOString() },
        storyz: { status: 'Idle', kbVersion: 'v4.1', lastUpdated: new Date().toISOString() },
        vocal: { status: 'Idle', kbVersion: 'v3.5', lastUpdated: new Date().toISOString() },
        pixelz: { status: 'Idle', kbVersion: 'v4.2', lastUpdated: new Date().toISOString() },
        fuzion: { status: 'Idle', kbVersion: 'v3.8', lastUpdated: new Date().toISOString() },
        socialz: { status: 'Idle', kbVersion: 'v4.5', lastUpdated: new Date().toISOString() },
    }
};

// Helper: Write to Obsidian as Markdown with Mapping
function writeToObsidian(agent, content, mappingData) {
    const fileName = `${agent}.md`;
    const filePath = path.join(KB_DIR, fileName);

    const timestamp = new Date().toISOString();
    const mappingHeader = `---
last_updated: ${timestamp}
mapping: ${JSON.stringify(mappingData)}
tags: [ProperOS, MasterKB, ${agent}]
---`;

    const entry = `\n\n## Update: ${timestamp}\n${content}\n`;

    fs.appendFileSync(filePath, mappingHeader + entry);
    return filePath;
}

app.get('/api/status', (req, res) => {
    res.json(systemState.agents);
});

app.post('/api/execute', (req, res) => {
    const { command, type } = req.body;

    if (type === 'workflow') {
        const projectId = `proj_${Date.now()}`;
        systemState.projects.push({ id: projectId, command, status: 'In Progress' });
        systemState.agents.viral.status = 'Processing: ' + command;

        // INTEGRATION: Map the run to the Knowledge Base
        // Every run adds to the 'intelligence' of the vault
        const learningContent = `Executed workflow for: "${command}".\n- Analysis patterns identified.\n- Conversion triggers mapped.`;
        const mapping = { projectId, intent: 'WorkflowExecution', complexity: 'High' };
        writeToObsidian('ProperViral', learningContent, mapping);

        return res.json({
            success: true,
            projectId: projectId,
            message: `Initiating FULL-SUITE Pipeline for: "${command}"`,
            pipeline: ['Viral', 'Storyz', 'VoCaL', 'Pixelz', 'Fuzion', 'Socialz']
        });
    }
    res.json({ success: true, message: `Processed request: ${command}` });
});

app.post('/api/sync', (req, res) => {
    Object.keys(systemState.agents).forEach(agent => {
        systemState.agents[agent].lastUpdated = new Date().toISOString();
        // Update Obsidian with a sync marker
        writeToObsidian(agent, "Knowledge base refined through system-wide synchronization.", { type: 'Sync' });
    });
    res.json({ success: true, message: 'Obsidian Master KB synchronized and expanded.' });
});

app.listen(PORT, () => {
    console.log(`ProperOS Backend running at http://localhost:${PORT}`);
    console.log(`Obsidian Vault mapped to: ${OBSIDIAN_VAULT_PATH}`);
});
