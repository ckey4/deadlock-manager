#include <bits/stdc++.h>
using namespace std;

struct Resource {
    int id;
    int total;
    int available;
};

struct Process {
    int id;
    vector<int> allocation;
    vector<int> request;
};

int main() {
    srand(time(0));

    int numProcesses = 5 + rand() % 6;  // 5-10 processes
    int numResources = 3 + rand() % 3;  // 3-5 resources

    vector<Resource> resources(numResources);
    for(int i=0;i<numResources;i++){
        resources[i].id = i;
        resources[i].total = 1 + rand() % 5;
        resources[i].available = resources[i].total;
    }

    vector<Process> processes(numProcesses);
    for(int i=0;i<numProcesses;i++){
        processes[i].id = i;
        processes[i].allocation.resize(numResources,0);
        processes[i].request.resize(numResources,0);
        for(int j=0;j<numResources;j++){
            processes[i].allocation[j] = rand() % (resources[j].available + 1);
            resources[j].available -= processes[i].allocation[j];
            processes[i].request[j] = rand() % (resources[j].total + 1);
        }
    }

    vector<bool> finished(numProcesses,false);
    bool progress = true;
    while(progress){
        progress = false;
        for(int i=0;i<numProcesses;i++){
            if(!finished[i]){
                bool canFinish = true;
                for(int j=0;j<numResources;j++){
                    if(processes[i].request[j] > resources[j].available){
                        canFinish = false;
                        break;
                    }
                }
                if(canFinish){
                    finished[i] = true;
                    progress = true;
                    for(int j=0;j<numResources;j++)
                        resources[j].available += processes[i].allocation[j];
                }
            }
        }
    }

    // Output JSON
    cout << "{\n\"processes\": [\n";
    for(int i=0;i<numProcesses;i++){
        cout << "  {\"id\":" << i 
             << ", \"deadlocked\":" << (!finished[i] ? "true" : "false") 
             << ", \"allocation\": [";
        for(int j=0;j<numResources;j++){
            cout << processes[i].allocation[j];
            if(j != numResources-1) cout << ",";
        }
        cout << "], \"request\": [";
        for(int j=0;j<numResources;j++){
            cout << processes[i].request[j];
            if(j != numResources-1) cout << ",";
        }
        cout << "] }";
        if(i != numProcesses-1) cout << ",";
        cout << "\n";
    }
    cout << "]\n}\n";

    return 0;
}
