# Future Enhancements

## WebSocket Real-Time Alerts (User Story 6)

**Status**: Deferred to future phase
**Priority**: P3
**Tracking**: Phase 8, Tasks T066-T067

### Overview

Real-time event notifications via WebSocket connections to provide immediate alerts
about agent fleet status changes, task completions, and failures.

### Requirements

1. **WebSocket Server**
   - Implement WebSocket endpoint for bidirectional communication
   - Support multiple concurrent superagent connections
   - Handle connection lifecycle (connect, disconnect, reconnect)

2. **Event Types**
   - `AGENT_FAILURE`: Agent enters error state or disconnects unexpectedly
   - `TASK_COMPLETION`: Agent completes assigned task successfully
   - `TASK_FAILURE`: Agent task fails with error
   - `CAPACITY_WARNING`: Fleet utilization exceeds threshold
   - `AGENT_CONNECTED`: New agent comes online
   - `AGENT_DISCONNECTED`: Agent goes offline

3. **Subscription Management**
   - Allow filtering by event type
   - Allow filtering by specific agent IDs
   - Support wildcards for fleet-wide subscriptions

### Implementation Approach

**Technology Options**:
- FastAPI WebSockets (if FastMCP supports)
- Socket.IO for broader client compatibility
- Server-Sent Events (SSE) as simpler alternative

**Architecture**:
```
Coder API (polling/webhooks)
    ↓
Event Processor (filters, transforms)
    ↓
WebSocket Broadcaster
    ↓
Subscribed Superagents
```

### Data Model

```python
class EventNotification(BaseModel):
    """Real-time event notification."""
    event_type: EventType  # Enum: AGENT_FAILURE, TASK_COMPLETION, etc.
    severity: EventSeverity  # Enum: INFO, WARNING, CRITICAL
    timestamp: datetime
    agent_id: Optional[str]
    task_id: Optional[str]
    message: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
```

### API Endpoints

**WebSocket Connection**:
```
ws://server/api/events/subscribe
```

**Subscription Format**:
```json
{
    "event_types": ["AGENT_FAILURE", "TASK_COMPLETION"],
    "agent_ids": ["agent-1", "agent-2"],
    "severity_min": "WARNING"
}
```

**Event Format**:
```json
{
    "event_type": "AGENT_FAILURE",
    "severity": "CRITICAL",
    "timestamp": "2025-10-27T14:30:00Z",
    "agent_id": "agent-123",
    "message": "Agent disconnected unexpectedly",
    "metadata": {
        "last_seen": "2025-10-27T14:29:45Z",
        "error": "Connection timeout"
    }
}
```

### Dependencies

- **Coder API Changes**: May need webhook support or streaming API
- **MCP Protocol**: Verify WebSocket/streaming support in MCP spec
- **FastMCP**: Check if framework supports WebSocket endpoints

### Testing Strategy

- Unit tests for event processor and filtering
- Integration tests with mock WebSocket clients
- Load testing for concurrent connections
- Chaos testing for connection failures

### Deployment Considerations

- WebSocket connections require persistent server process (not serverless)
- Load balancing with sticky sessions or Redis pub/sub
- Connection limits and rate limiting
- Authentication for WebSocket connections

### Estimated Effort

- Design & Prototyping: 2-3 days
- Implementation: 5-7 days
- Testing & Documentation: 2-3 days
- **Total**: 9-13 days

### Alternative: Polling-Based Approach

If WebSockets prove complex, consider:
- Server-Sent Events (SSE) for one-way push notifications
- Long-polling with timeout and retry logic
- Periodic polling with short intervals (5-10 seconds)

**Tradeoffs**:
- Higher latency for event delivery
- More network overhead
- Simpler implementation and deployment

### Notes

This feature is deferred because:
1. Core fleet management functionality takes priority
2. Polling-based queries satisfy immediate needs
3. WebSocket complexity requires dedicated sprint
4. Coder API may not yet support real-time events

When implementing, ensure backward compatibility with existing polling-based workflows.
