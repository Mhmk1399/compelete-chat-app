function registerContactRoutes(app, deps) {
  const {
    emitSseEvent,
    findDmChat,
    findUserByUsername,
    getContactName,
    setContactName,
    deleteContactName,
    hideChatsForUser,
    requireSession,
    requireSessionUsernameMatch,
  } = deps;

  // PUT /api/contacts/:contactUsername — save (or clear) a custom contact name
  app.put("/api/contacts/:contactUsername", (req, res) => {
    const session = requireSession(req, res);
    if (!session) return;

    const contactUsername = String(req.params?.contactUsername || "").trim().toLowerCase();
    const { username, name } = req.body || {};

    if (!username || !contactUsername) {
      return res.status(400).json({ error: "Username and contactUsername are required." });
    }
    if (!requireSessionUsernameMatch(res, session, username)) return;
    if (username.toLowerCase() === contactUsername) {
      return res.status(400).json({ error: "Cannot set a contact name for yourself." });
    }

    const owner = findUserByUsername(String(username || "").toLowerCase());
    if (!owner) {
      return res.status(404).json({ error: "User not found." });
    }
    const contact = findUserByUsername(contactUsername);
    if (!contact) {
      return res.status(404).json({ error: "Contact user not found." });
    }

    const trimmedName = String(name || "").trim();
    setContactName(owner.id, contactUsername, trimmedName);

    // Notify the owner's client that the chat list has changed
    const dmChatId = findDmChat(owner.id, contact.id);
    if (dmChatId) {
      try {
        emitSseEvent(String(owner.username || "").toLowerCase(), {
          type: "chat_list_changed",
          chatId: dmChatId,
        });
      } catch {
        // ignore realtime errors
      }
    }

    return res.json({ ok: true, name: trimmedName || null });
  });

  // DELETE /api/contacts/:contactUsername — hide the DM and remove custom name
  app.delete("/api/contacts/:contactUsername", (req, res) => {
    const session = requireSession(req, res);
    if (!session) return;

    const contactUsername = String(req.params?.contactUsername || "").trim().toLowerCase();
    const { username } = req.body || {};

    if (!username || !contactUsername) {
      return res.status(400).json({ error: "Username and contactUsername are required." });
    }
    if (!requireSessionUsernameMatch(res, session, username)) return;

    const owner = findUserByUsername(String(username || "").toLowerCase());
    if (!owner) {
      return res.status(404).json({ error: "User not found." });
    }
    const contact = findUserByUsername(contactUsername);
    if (!contact) {
      return res.status(404).json({ error: "Contact user not found." });
    }

    // Remove custom name
    deleteContactName(owner.id, contactUsername);

    // Hide the DM chat from the owner's list
    const dmChatId = findDmChat(owner.id, contact.id);
    if (dmChatId) {
      hideChatsForUser(owner.id, [dmChatId]);
      try {
        emitSseEvent(String(owner.username || "").toLowerCase(), {
          type: "chat_list_changed",
          chatId: dmChatId,
        });
      } catch {
        // ignore realtime errors
      }
    }

    return res.json({ ok: true });
  });
}

export { registerContactRoutes };
