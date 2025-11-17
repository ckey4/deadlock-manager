#include<bits/stdc++.h>
using namespace std;
struct Process {
    string name;
    int priority;
    Process() : name(""), priority(0) {}
    Process(string n, int p) : name(n), priority(p) {}
};
class deadlockManager{
    private:
        unordered_map<string,vector<string>> adj;
        unordered_map<string, Process> processes;
        unordered_set<string> resources;
    public:
    
    void addProcess(string name, int priority) {
        processes[name] = Process(name, priority);
        adj[name] = {}; 
    }

    void addResource(string name) {
        resources.insert(name);
        adj[name] = {}; 
    }
    void addEdge(string src, string dest){
            adj[src].push_back(dest);
        }

    
    bool dfs(string node, map<string, bool> &vis, map<string, bool> &pathVis) {
        vis[node] = true;
        pathVis[node] = true; 
        for (string neigh : adj[node]) {
            if (pathVis[neigh]) return true;      
            if (!vis[neigh] && dfs(neigh, vis, pathVis)) return true;
        }
        pathVis[node] = false; 
        return false;
    }

    bool detectCycle() {
        map<string, bool> vis, pathVis;
        for (auto &p : adj) {
            if (!vis[p.first] && dfs(p.first, vis, pathVis))
                return true;
        }
        return false;
    }

    void displayGraph(){
        cout<<"Reasource Allocation graph:\n";
        for(auto it:adj){
            cout<<" "<<it.first<<" -> ";
            for(auto v:it.second){
                cout<<v<<" ";
            }
            cout<<endl;
        }
    }

    string resolveDeadlock() {
        cout << "\nDeadlock detected! Resolving adaptively...\n";
        string victim = "";
        int minPriority = 1e9;
        int minEdges = 1e9;

        for (auto &p : processes) {
            string name = p.first;
            int priority = p.second.priority;
            int edges = adj[name].size();

            if (priority < minPriority || (priority == minPriority && edges < minEdges)) {
                minPriority = priority;
                minEdges = edges;
                victim = name;
            }
        }

        if (!victim.empty()) {
            cout << "Victim chosen for termination: " << victim << "\n";
            adj.erase(victim);
            processes.erase(victim);
            for (auto &p : adj) {
                vector<string> newEdges;
                for (auto &to : p.second)
                    if (to != victim) newEdges.push_back(to);
                p.second = newEdges;
            }
        }
        return victim;
    }

    void randomAllocate() {
        vector<string> procNames;
        for (auto &p : processes) procNames.push_back(p.first);
        vector<string> resNames(resources.begin(), resources.end());

        for (string p : procNames) {
            int reqCount = rand() % resNames.size() + 1; // 1 to n resources
            for (int i = 0; i < reqCount; i++) {
                string r = resNames[rand() % resNames.size()];
                string allocatedTo = procNames[rand() % procNames.size()];
                addEdge(p, r);       
                addEdge(r, allocatedTo); 
            }
        }
    }

};
int main(){
    srand(time(0));
    deadlockManager dm;
    
    int numProcesses, numResources;
    cout << "Enter number of processes: ";
    cin >> numProcesses;
    cout << "Enter number of resources: ";
    cin >> numResources;

    // Add processes dynamically
    for (int i = 1; i <= numProcesses; i++) {
        int priority;
        cout << "Enter priority for process P" << i << ": ";
        cin >> priority;
        dm.addProcess("P" + to_string(i), priority);
    }

    // Add resources dynamically
    for (int i = 1; i <= numResources; i++) {
        dm.addResource("R" + to_string(i));
    }

    // Randomly allocate resources to processes
    dm.randomAllocate();

    cout << "\nInitial Resource Allocation Graph:";
    dm.displayGraph();

    // Check and resolve deadlocks repeatedly
    while (dm.detectCycle()) {
        dm.resolveDeadlock();
        dm.displayGraph();
    }

    cout << "\nNo more deadlocks. Simulation complete.\n";
    return 0;
}
