#!/bin/bash

echo "export const environment = {" > src/environments/environment.prod.ts
echo "  production: true," >> src/environments/environment.prod.ts
echo "  apiUrl: '${API_URL}'" >> src/environments/environment.prod.ts
echo "};" >> src/environments/environment.prod.ts
