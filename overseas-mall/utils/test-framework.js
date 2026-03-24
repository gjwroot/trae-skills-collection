class TestFramework {
  constructor() {
    this.suites = [];
    this.currentSuite = null;
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  describe(name, fn) {
    this.currentSuite = {
      name,
      tests: [],
      beforeAll: null,
      afterAll: null,
      beforeEach: null,
      afterEach: null
    };
    this.suites.push(this.currentSuite);
    fn();
    this.currentSuite = null;
  }

  beforeAll(fn) {
    if (this.currentSuite) {
      this.currentSuite.beforeAll = fn;
    }
  }

  afterAll(fn) {
    if (this.currentSuite) {
      this.currentSuite.afterAll = fn;
    }
  }

  beforeEach(fn) {
    if (this.currentSuite) {
      this.currentSuite.beforeEach = fn;
    }
  }

  afterEach(fn) {
    if (this.currentSuite) {
      this.currentSuite.afterEach = fn;
    }
  }

  it(name, fn) {
    if (this.currentSuite) {
      this.currentSuite.tests.push({ name, fn });
    }
  }

  expect(actual) {
    return {
      toBe: (expected) => {
        if (actual !== expected) {
          throw new Error(`Expected ${expected} but got ${actual}`);
        }
      },
      toEqual: (expected) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
        }
      },
      toBeTruthy: () => {
        if (!actual) {
          throw new Error(`Expected truthy value but got ${actual}`);
        }
      },
      toBeFalsy: () => {
        if (actual) {
          throw new Error(`Expected falsy value but got ${actual}`);
        }
      },
      toBeNull: () => {
        if (actual !== null) {
          throw new Error(`Expected null but got ${actual}`);
        }
      },
      toBeDefined: () => {
        if (actual === undefined) {
          throw new Error(`Expected defined value but got undefined`);
        }
      },
      toBeGreaterThan: (expected) => {
        if (actual <= expected) {
          throw new Error(`Expected ${actual} to be greater than ${expected}`);
        }
      },
      toBeLessThan: (expected) => {
        if (actual >= expected) {
          throw new Error(`Expected ${actual} to be less than ${expected}`);
        }
      },
      toContain: (expected) => {
        if (!actual.includes(expected)) {
          throw new Error(`Expected ${actual} to contain ${expected}`);
        }
      },
      toHaveLength: (expected) => {
        if (actual.length !== expected) {
          throw new Error(`Expected length ${expected} but got ${actual.length}`);
        }
      },
      toThrow: () => {
        let thrown = false;
        try {
          actual();
        } catch (e) {
          thrown = true;
        }
        if (!thrown) {
          throw new Error(`Expected function to throw`);
        }
      }
    };
  }

  async run() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      tests: []
    };

    for (const suite of this.suites) {
      console.log(`\n📦 Suite: ${suite.name}`);

      if (suite.beforeAll) {
        try {
          await suite.beforeAll();
        } catch (error) {
          console.error(`  ❌ beforeAll failed: ${error.message}`);
        }
      }

      for (const test of suite.tests) {
        this.results.total++;

        if (suite.beforeEach) {
          try {
            await suite.beforeEach();
          } catch (error) {
            console.error(`  ❌ beforeEach failed: ${error.message}`);
          }
        }

        try {
          await test.fn();
          this.results.passed++;
          this.results.tests.push({
            suite: suite.name,
            name: test.name,
            status: 'passed'
          });
          console.log(`  ✅ ${test.name}`);
        } catch (error) {
          this.results.failed++;
          this.results.tests.push({
            suite: suite.name,
            name: test.name,
            status: 'failed',
            error: error.message
          });
          console.log(`  ❌ ${test.name}`);
          console.error(`     Error: ${error.message}`);
        }

        if (suite.afterEach) {
          try {
            await suite.afterEach();
          } catch (error) {
            console.error(`  ❌ afterEach failed: ${error.message}`);
          }
        }
      }

      if (suite.afterAll) {
        try {
          await suite.afterAll();
        } catch (error) {
          console.error(`  ❌ afterAll failed: ${error.message}`);
        }
      }
    }

    this.printSummary();
    return this.results;
  }

  printSummary() {
    console.log('\n📊 Test Summary:');
    console.log(`   Total: ${this.results.total}`);
    console.log(`   Passed: ${this.results.passed}`);
    console.log(`   Failed: ${this.results.failed}`);
    console.log(`   Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
  }
}

module.exports = new TestFramework();