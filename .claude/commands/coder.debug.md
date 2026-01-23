---
name: coder.debug
description: Debug a Coder workspace by analyzing logs and Kubernetes state to identify root causes and solutions
argument-hint: [workspace ID]
---

# Coder Workspace Debugger

Debug a Coder workspace by analyzing logs and Kubernetes state to identify root causes and solutions.

**Workspace ID**: $ARGUMENTS

<objective>
Investigate why the Coder workspace "$ARGUMENTS" is experiencing problems. Perform a comprehensive root cause analysis by examining workspace logs, Kubernetes pod state, and system events. Generate a prioritized list of solutions ranked by confidence level.
</objective>

<investigation_steps>

## Step 1: Validate Workspace Exists

First, verify the workspace exists and get its current status:

```bash
coder list | grep -E "(Name|$ARGUMENTS)"
```

If the workspace doesn't exist, report this and stop.

## Step 2: Check Kubernetes Pod State

Identify the pod(s) associated with this workspace in the `coder-workspace` namespace:

```bash
kubectl get pods -n coder-workspace -o wide | grep -E "(NAME|$ARGUMENTS)"
```

Check for pods in non-Running states (Pending, CrashLoopBackOff, Error, etc.):

```bash
kubectl describe pod -n coder-workspace -l "com.coder.workspace.name=$ARGUMENTS"
```

## Step 3: Gather Kubernetes Logs

Get recent pod logs for the workspace:

```bash
kubectl logs -n coder-workspace -l "com.coder.workspace.name=$ARGUMENTS" --tail=200
```

If the pod has restarted, also check previous container logs:

```bash
kubectl logs -n coder-workspace -l "com.coder.workspace.name=$ARGUMENTS" --previous --tail=100 2>/dev/null || echo "No previous logs available"
```

Check for events related to the workspace:

```bash
kubectl get events -n coder-workspace --sort-by='.lastTimestamp' | grep -i "$ARGUMENTS" | tail -30
```

## Step 4: SSH Log File Discovery

List available log files in the workspace's /tmp directory:

```bash
coder ssh $ARGUMENTS -- ls -la /tmp/*.log /tmp/coder*.log 2>/dev/null || echo "No log files found or SSH failed"
```

Also check common log locations:

```bash
coder ssh $ARGUMENTS -- ls -la /var/log/ 2>/dev/null | head -20
```

## Step 5: Analyze Startup Script Logs

Read the Coder startup script log (primary diagnostic source):

```bash
coder ssh $ARGUMENTS -- cat /tmp/coder-startup-script.log 2>/dev/null || echo "Startup script log not found"
```

## Step 6: Check Agent Logs

Read Coder agent logs if available:

```bash
coder ssh $ARGUMENTS -- cat /tmp/coder-agent.log 2>/dev/null || echo "Agent log not found"
```

## Step 7: System State Check

Check basic system health inside the workspace:

```bash
coder ssh $ARGUMENTS -- "df -h; echo '---'; free -h; echo '---'; uptime" 2>/dev/null || echo "Cannot access workspace system"
```

Check for any crashed processes:

```bash
coder ssh $ARGUMENTS -- "dmesg | tail -20" 2>/dev/null || echo "Cannot read dmesg"
```

</investigation_steps>

<analysis_requirements>

After gathering all logs and state information, perform a thorough root cause analysis:

1. **Identify Error Patterns**: Look for error messages, stack traces, and failure indicators across all log sources
2. **Timeline Reconstruction**: Build a timeline of events leading to the problem
3. **Resource Analysis**: Check for resource exhaustion (disk, memory, CPU)
4. **Dependency Check**: Identify any failed dependencies or missing prerequisites
5. **Configuration Issues**: Look for misconfigurations in startup scripts or environment

</analysis_requirements>

<output_format>

## Debug Summary: $ARGUMENTS

### Workspace Status
[Current state of the workspace - running, stopped, failed, etc.]

### Problem Description
[Concise description of the observed problem]

### Root Cause Analysis

**Primary Cause**: [Most likely root cause based on evidence]

**Evidence**:
- [Log excerpt or observation 1]
- [Log excerpt or observation 2]
- [Additional supporting evidence]

**Contributing Factors**:
- [Any secondary issues discovered]

### Timeline of Events
1. [Event 1 with timestamp if available]
2. [Event 2]
3. [Current state]

### Solutions (Ranked by Confidence)

#### 1. [Highest Confidence Solution] - **Confidence: High (80-100%)**
- **Action**: [Specific steps to resolve]
- **Rationale**: [Why this is likely to work]
- **Risk**: [Any risks or side effects]

#### 2. [Second Solution] - **Confidence: Medium (50-80%)**
- **Action**: [Specific steps]
- **Rationale**: [Why this might work]
- **Risk**: [Risks]

#### 3. [Third Solution] - **Confidence: Low (20-50%)**
- **Action**: [Specific steps]
- **Rationale**: [Why to try this if others fail]
- **Risk**: [Risks]

### Additional Recommendations
- [Any preventive measures]
- [Monitoring suggestions]
- [Configuration improvements]

</output_format>

<constraints>
- If SSH fails completely, focus analysis on Kubernetes logs and pod state
- If the workspace ID is invalid, clearly state this and list available workspaces
- Do not make destructive changes - this is a diagnostic command only
- Include exact log excerpts as evidence for conclusions
- Be specific about commands that failed vs succeeded
</constraints>
