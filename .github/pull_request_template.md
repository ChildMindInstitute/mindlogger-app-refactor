<!-- Use this template as a guide to describe your pull request, and adjust as necessary. -->
<!-- Include information that helps your peers review your updates and understand this    -->
<!-- repository's history of changes over time.                                           -->

### 📝 Description

<!-- Contributions are welcome! If there is a corresponding      -->
<!-- JIRA ticket, link to it by replacing `#` with ticket number -->

🔗 [Jira Ticket M2-#](https://mindlogger.atlassian.net/browse/M2-#)

<!-- Replace this with a high-level description of the features/functionality proposed in the pull request. -->

Changes include:

- [Thing]
- [Other thing]
- [More things]

### 📸 Screenshots

<!--
If your work here contains visual changes, provide before (optional) and after screenshots, GIFs, or videos.

If not, then delete this section
-->

| Before (Optional)                      | After                                 |
| -------------------------------------- | ------------------------------------- |
| <!-- Paste before image/video here --> | <!-- Paste after image/video here --> |

### 🪤 Peer Testing

<!-- If peer testing is not needed, then delete this section -->
<!-- Uncomment out any of the following as needed:           -->
<!-- **Requires `yarn install`**     -->
<!-- **Requires `yarn pods`**        -->

<!--
Replace this with a series of test steps & expected outcomes.

Example test step:

- This is a test step.  Highlight actions **in bold**.

    **Expected outcome:** This is what to expect after the step
-->

### ✏️ Notes

<!--
Replace this line with anything else you think may be relevant or related PRs

If there are no notes, then delete this section.
-->

### ✅ Checklist

### Functionality

- [ ] The feature behaves correctly in practice and fulfills the intended business purpose
- [ ] The implementation accounts for edge cases, avoids subtle logical errors, and handles somewhat rare failure states (e.g. offline mode for mobile, 3rd party being down, etc)

### Testing

- [ ] Verify there are automated tests added that meaningfully cover critical behavior and failure cases
- [ ] Code coverage does not go down as result of this change
- [ ] Test suite passes

### Security & Data Privacy

- [ ] Verify there is no chance we would accidentally log PII to application logs
- [ ] Verify this addition does not materially affect our security attack surface, and if so it has undergone security review
- [ ] All inputs are sanitized
- [ ] New dependencies are well maintained, have significant justification for being added to the project, and are documented in the Curious [open source credit page](https://mindlogger.atlassian.net/jira/servicedesk/projects/MLA/knowledge/articles/340623543?spaceKey=MLA)

### Logging/Monitoring

- [ ] Logging is implemented for this change such that you could troubleshoot this feature in production
- [ ] The change/feature is able to be monitored in production

### Performance

- [ ] This change does not introduce n+1 queries or other performance issues within our expected scale (e.g. missing indexes on frequently queried columns, frequently updating tables that are accessed often)

### Readability

- [ ] All commented out code is removed
- [ ] Debugging code including extraneous log lines are removed
- [ ] Code is easy to understand through naming and structure; comments explain intent or non‑obvious decisions

### Change Safety

- [ ] Backend changes are backwards compatible with old clients, or it is well known they are not and a deployment/rollout plan is in place. This include backend changes being compatible with old mobile app versions, as well as applet versioning within Curious.
- [ ] Destructive database migrations are rolled out in stages. For example, renaming a column means adding a new column and migrating the existing data to that columns in one deployment. Then monitoring to ensure that field isn’t used, and finally removing that old column in a separate deployment.
