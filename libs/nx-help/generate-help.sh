#!/usr/bin/env bash
set -e

# Create output directory
mkdir -p libs/nx-help/dist

# Get all projects using Moon
# shellcheck disable=SC2312
PROJECTS=$(moon query projects --json 2>/dev/null | jq -r '.projects[].id' | sort)

# Initialize JSON structure
echo '{
  "projects": [' > libs/nx-help/dist/projects.json

first=true
while IFS= read -r project; do
  if [[ -n "${project}" ]]; then
    # Get project details from Moon
    # shellcheck disable=SC2312
    project_data=$(moon query projects --json 2>/dev/null | jq ".projects[] | select(.id == \"${project}\")") || continue

    if [[ -n "${project_data}" ]]; then
      # Add comma separator for all but first entry
      if [[ "${first}" == "true" ]]; then
        first=false
      else
        echo "    ," >> libs/nx-help/dist/projects.json
      fi

      # Extract project name and description
      name=$(echo "${project_data}" | jq -r '.id')
      description=$(echo "${project_data}" | jq -r '.description // ""')

      # Get tasks for this project
      # shellcheck disable=SC2312
      tasks_data=$(moon query tasks --json 2>/dev/null | jq ".tasks[\"${project}\"] // {}") || tasks_data="{}"

      # Build project entry with targets
      # shellcheck disable=SC2129
      echo "    {" >> libs/nx-help/dist/projects.json
      echo "      \"name\": \"${name}\"," >> libs/nx-help/dist/projects.json
      echo "      \"description\": \"${description}\"," >> libs/nx-help/dist/projects.json
      echo "      \"targets\": [" >> libs/nx-help/dist/projects.json

      # Extract targets from tasks
      target_first=true
      # shellcheck disable=SC2312
      while IFS= read -r task_name; do
        if [[ -n "${task_name}" ]]; then
          if [[ "${target_first}" == "true" ]]; then
            target_first=false
          else
            echo "        ," >> libs/nx-help/dist/projects.json
          fi

          # shellcheck disable=SC2129
          echo "        {" >> libs/nx-help/dist/projects.json
          echo "          \"name\": \"${task_name}\"," >> libs/nx-help/dist/projects.json
          echo "          \"description\": \"\"" >> libs/nx-help/dist/projects.json
          echo -n "        }" >> libs/nx-help/dist/projects.json
        fi
      done <<< "$(echo "${tasks_data}" | jq -r 'keys[]' 2>/dev/null || echo "")"

      # shellcheck disable=SC2129
      echo "" >> libs/nx-help/dist/projects.json
      echo "      ]" >> libs/nx-help/dist/projects.json
      echo -n "    }" >> libs/nx-help/dist/projects.json
    fi
  fi
done <<< "${PROJECTS}"

# Close JSON structure
# shellcheck disable=SC2129
echo "" >> libs/nx-help/dist/projects.json
echo "  ]" >> libs/nx-help/dist/projects.json
echo "}" >> libs/nx-help/dist/projects.json
