## Environment Setup

1. Populate `DATABASE_URL` and `DB_SCHEMA` in your `.env.<local | mvp | dev | qa | prod>` file.
2. If running locally, create a file named `.env.local`.
3. You can use `.env.sample` as a reference.
4. Set the correct `.env` file in your environment using the `ENV_FILE` variable.

### Example

```bash
export ENV_FILE=.env.local
```

### Run the App

uvicorn app.main:app --reload
