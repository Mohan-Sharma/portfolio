# ADR-0004: Data Validation Strategy

## Status

**Accepted**

**Date**: 2025-12-31
**Deciders**: Development Team
**Consulted**: TypeScript best practices, validation library comparisons
**Informed**: All stakeholders

---

## Context

The portfolio requires structured CV data (personal info, experience, projects, skills, education) that needs to be:

- Type-safe at compile time (TypeScript)
- Validated at runtime (catch data errors early)
- Easily maintainable (single source of truth)
- Self-documenting (schemas describe data shape)
- Exportable/importable (for future CMS integration)

We need a validation strategy that:

- Provides both TypeScript types and runtime validation
- Has a clear, readable schema definition syntax
- Supports complex nested data structures
- Generates helpful error messages
- Is performant (validation runs at build time)
- Integrates well with SvelteKit

### Assumptions

- CV data is relatively static (not frequently changing)
- Data validation happens at build time primarily
- Future: may integrate with headless CMS
- Developer should get immediate feedback on data errors

### Constraints

- Must generate TypeScript types
- Must validate at runtime
- Should not significantly increase bundle size
- Must work with SvelteKit's build process

### Requirements

- Schema-first data modeling
- Type inference for TypeScript
- Runtime validation
- Clear error messages
- Support for arrays, nested objects, enums
- Optional vs required field handling
- Custom validation rules (email, URL, etc.)

---

## Decision Drivers

1. **Type Safety**: Compile-time type checking in TypeScript
2. **Runtime Validation**: Catch data errors before they reach production
3. **Developer Experience**: Clear schemas, good error messages
4. **Single Source of Truth**: Schema generates both types and validation
5. **Bundle Size**: Minimal runtime impact
6. **Ecosystem**: Good documentation and community support

---

## Options Considered

### Option 1: Zod (Recommended)

**Description**: TypeScript-first schema validation library with type inference.

**Pros**:

- **Type inference**: TypeScript types automatically inferred from schemas
- **Single source of truth**: Schema defines both types and validation
- **Excellent DX**: Chainable API, clear syntax
- **Rich built-in validators**: string, number, email, url, date, etc.
- **Composable schemas**: Easy to build complex nested structures
- **Great error messages**: Detailed validation errors
- **Zero dependencies**: Small bundle impact
- **Active development**: Large community, regular updates
- **Framework-agnostic**: Works anywhere JavaScript runs
- **SvelteKit integration**: Perfect fit

**Cons**:

- Adds ~50KB to bundle (but tree-shakeable)
- Schemas can be verbose for very complex structures
- Runtime validation has performance cost (but runs at build time for us)

**Costs**:

- Bundle: ~50KB unminified, ~14KB gzipped (only included in build process for us)
- Learning: Low (intuitive API)
- Maintenance: Low (stable API)

**Example**:

```typescript
import { z } from 'zod';

const ProjectSchema = z.object({
	title: z.string().min(1),
	description: z.string(),
	techStack: z.array(z.string()),
	url: z.string().url().optional()
});

type Project = z.infer<typeof ProjectSchema>;

// Runtime validation
const project = ProjectSchema.parse(data);
```

---

### Option 2: Yup

**Description**: Schema validation library inspired by Joi, popular in React ecosystem.

**Pros**:

- Mature and stable
- Good documentation
- Async validation support
- Used in Formik (popular form library)
- Chainable API

**Cons**:

- **TypeScript support is secondary** (not type-first)
- Requires additional `@types/yup` package
- Type inference is less elegant than Zod
- Larger bundle size (~60KB)
- Slower development compared to Zod
- Less idiomatic TypeScript

**Costs**:

- Bundle: ~60KB
- Learning: Low-Medium
- Maintenance: Medium

---

### Option 3: io-ts

**Description**: Runtime type system for TypeScript using functional programming.

**Pros**:

- Strong type inference
- Functional programming approach
- Bidirectional validation (encode/decode)
- TypeScript-first design

**Cons**:

- **Steep learning curve** (functional programming concepts)
- Verbose syntax
- Smaller community than Zod/Yup
- Less intuitive for non-FP developers
- More boilerplate code

**Costs**:

- Bundle: ~40KB
- Learning: High (FP concepts)
- Maintenance: Medium-High

**Example**:

```typescript
import * as t from 'io-ts';

const ProjectCodec = t.type({
	title: t.string,
	description: t.string,
	techStack: t.array(t.string),
	url: t.union([t.string, t.undefined])
});

type Project = t.TypeOf<typeof ProjectCodec>;
```

---

### Option 4: TypeScript Interfaces Only (No Runtime Validation)

**Description**: Use TypeScript interfaces/types without runtime validation.

**Pros**:

- **Zero bundle size** (compile-time only)
- Simple to implement
- No library dependency
- Fast (no runtime overhead)

**Cons**:

- **No runtime validation** (major risk)
- Can't catch data errors at build time
- Manual validation needed
- No guarantee data matches types
- Errors only surface in development or production
- TypeScript types are erased at runtime

**Costs**:

- Bundle: 0KB
- Learning: Zero
- Maintenance: Low
- **Major Risk**: Runtime type errors

---

### Option 5: JSON Schema + TypeScript Generation

**Description**: Define schemas in JSON Schema format, generate TypeScript types.

**Pros**:

- Standard format (JSON Schema)
- Can validate JSON files
- Tooling available
- Portable (language-agnostic)

**Cons**:

- **Two-step process**: Schema → Generate Types → Import
- Less type-safe during development
- Requires build step for type generation
- More complex workflow
- Harder to keep in sync
- JSON Schema is verbose

**Costs**:

- Bundle: Variable (depends on validation library)
- Learning: Medium
- Maintenance: Medium-High

---

## Decision

**Chosen Option**: **Option 1 - Zod**

### Rationale

Zod was chosen as the clear winner because:

1. **TypeScript-First Design**: Zod is built for TypeScript. The type inference is exceptional:

   ```typescript
   const Schema = z.object({ name: z.string() });
   type Type = z.infer<typeof Schema>; // Automatic type!
   ```

   This eliminates the duplication and potential mismatch between types and validation.

2. **Single Source of Truth**: The schema **is** the type definition and validation logic. One schema generates:
   - TypeScript types (compile-time safety)
   - Runtime validation (catch data errors)
   - Type guards (narrowing)

   This dramatically reduces maintenance burden.

3. **Developer Experience**: Zod's API is intuitive and readable:

   ```typescript
   const CVSchema = z.object({
   	personal: z.object({
   		name: z.string().min(1, 'Name required'),
   		email: z.string().email('Invalid email'),
   		phone: z.string().optional()
   	}),
   	experience: z.array(ExperienceSchema),
   	projects: z.array(ProjectSchema).min(1)
   });
   ```

   This reads like documentation.

4. **Excellent Error Messages**: When validation fails, Zod provides detailed, actionable errors:

   ```typescript
   {
   	issues: [
   		{
   			path: ['personal', 'email'],
   			message: 'Invalid email',
   			code: 'invalid_string'
   		}
   	];
   }
   ```

5. **Build-Time Validation**: In our use case, CV data is validated at build time:

   ```typescript
   // data/cv-data.ts
   import { validateCVData } from './schemas/cv.schema';

   export const cvData = validateCVData({
   	// data here - TypeScript checks types AND
   	// Zod validates at build time
   });
   ```

   Any data errors fail the build immediately, not in production.

6. **Zero Runtime Cost for Users**: Since validation happens at build time, the validation code doesn't ship to users. Zod is a dev dependency only.

7. **Future-Proof**: If we add a CMS later, Zod can validate CMS data at runtime:

   ```typescript
   const result = CVSchema.safeParse(cmsData);
   if (result.success) {
   	// Use result.data
   } else {
   	// Handle errors
   }
   ```

8. **Rich Built-in Validators**: Zod includes validators for common patterns:
   - `z.string().email()`
   - `z.string().url()`
   - `z.string().uuid()`
   - `z.number().min()`, `z.number().max()`
   - `z.date()`
   - `z.enum()`, `z.union()`
   - Custom refinements

9. **Composability**: Schemas can be composed and extended:
   ```typescript
   const BaseProjectSchema = z.object({ title: z.string() });
   const ExtendedProjectSchema = BaseProjectSchema.extend({
   	featured: z.boolean()
   });
   ```

### Implementation Notes

**Project Structure**:

```
data/
├── schemas/
│   ├── cv.schema.ts      # All Zod schemas
│   └── index.ts          # Export all schemas
├── cv-data.ts            # CV data (validated)
└── index.ts              # Export validated data
```

**Build-Time Validation**:

```typescript
// data/cv-data.ts
import { validateCVData } from './schemas/cv.schema';

export const cvData = validateCVData({
	personal: {
		/* ... */
	}
	// If this data doesn't match schema, build fails!
});
```

**Runtime Validation (Future CMS)**:

```typescript
// Future: Validate CMS data at runtime
import { CVDataSchema } from './schemas/cv.schema';

async function loadCVData() {
	const response = await fetch('/api/cv');
	const data = await response.json();

	const result = CVDataSchema.safeParse(data);
	if (!result.success) {
		console.error('Invalid CV data:', result.error);
		return fallbackData;
	}

	return result.data; // Type-safe!
}
```

**Schema Organization**:

- One schema file for all CV-related schemas
- Export both schemas and inferred types
- Create helper functions (validate, safeValidate)
- Document schemas with JSDoc comments

---

## Consequences

### Positive

- **Type Safety Everywhere**: Compile-time and runtime
- **Early Error Detection**: Catch data errors during development
- **Self-Documenting**: Schemas describe data structure clearly
- **Reduced Bugs**: Invalid data can't enter the system
- **Great DX**: IDE autocomplete, type checking, validation in one place
- **Future-Ready**: Easy to add CMS integration later
- **Maintainable**: Single source of truth for data structure

### Negative

- **Dependency**: Adds Zod as a dependency (~50KB, but dev-only for our use case)
- **Verbosity**: Complex schemas can be verbose (but readable)
- **Learning**: Team needs to learn Zod API (but it's simple)

### Neutral

- **Build Step Required**: Validation runs at build time (acceptable, we already have a build step)
- **Schema Maintenance**: Schemas need updating when data structure changes (but would need to update types anyway)

### Risks

- **Risk**: Zod becomes unmaintained
  - **Mitigation**: Very active project with large community; could migrate to alternatives if needed

- **Risk**: Schema complexity grows
  - **Mitigation**: Keep schemas modular and composable; refactor as needed

- **Risk**: Validation performance
  - **Mitigation**: Validation happens at build time, not runtime (for static data)

---

## Validation

Success criteria:

- [x] Zod schemas created for all CV data structures
- [x] CV data validates successfully at build time
- [ ] TypeScript types automatically inferred from schemas
- [ ] Build fails if data doesn't match schema
- [ ] Clear error messages when validation fails
- [ ] No Zod code in production bundle (unless needed for CMS)

---

## Follow-up Actions

- [x] Install Zod (`pnpm add zod`)
- [x] Create CV data schemas
- [x] Validate CV data at build time
- [ ] Document schema patterns
- [ ] Create validation utilities
- [ ] Add pre-commit validation hook

---

## Related Decisions

- [ADR-0001: Tech Stack Selection](./0001-tech-stack-selection.md) - TypeScript and build process
- Future ADR: CMS Integration (when we add CMS, Zod will validate API responses)

---

## References

- [Zod Official Site](https://zod.dev/)
- [Zod GitHub](https://github.com/colinhacks/zod)
- [TypeScript Schema Validation Comparison](https://github.com/colinhacks/zod#comparison)
- [Zod Best Practices](https://zod.dev/?id=introduction)

---

## Notes

- Zod is MIT licensed (permissive)
- Works great with SvelteKit
- Can be used for form validation too (if we add a contact form)
- Explore zod-to-json-schema if we need JSON Schema output later

---

**Revision History**:

- 2025-12-31: Initial decision recorded
