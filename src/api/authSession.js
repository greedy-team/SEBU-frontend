// Cookie-changing requests share a queue so recovery cannot delete a newer login.
let pendingAuth = Promise.resolve();
let recovery = null;
let revision = 0;

export const getAuthRevision = () => revision;

function enqueue(operation) {
  const result = pendingAuth.then(operation);
  pendingAuth = result.catch(() => {});
  return result;
}

export function runAuthMutation(operation) {
  return enqueue(async () => {
    const result = await operation();
    revision += 1;
    return result;
  });
}

export function recoverInvalidSession(requestRevision, resetCookies) {
  if (requestRevision !== revision) return Promise.resolve();
  if (!recovery) {
    recovery = enqueue(async () => {
      // A login or refresh ahead of us may already have replaced the bad cookie.
      if (requestRevision !== revision) return;
      await resetCookies();
      revision += 1;
    }).finally(() => {
      recovery = null;
    });
  }
  return recovery;
}
