export class Mutex {
  private queue: (() => void)[] = [];
  private locked = false;

  async acquire(): Promise<() => void> {
    return new Promise<() => void>((resolve) => {
      const tryAcquire = () => {
        if (!this.locked) {
          this.locked = true;
          resolve(this.release.bind(this));
        } else {
          this.queue.push(tryAcquire);
        }
      };

      tryAcquire();
    });
  }

  private release() {
    const next = this.queue.shift();
    if (next) {
      next(); // Let the next caller acquire the lock
    } else {
      this.locked = false;
    }
  }

  async runExclusive<T>(callback: () => Promise<T>): Promise<T> {
    const release = await this.acquire();
    try {
      return await callback();
    } finally {
      release();
    }
  }
}
