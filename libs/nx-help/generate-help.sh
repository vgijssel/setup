#!/usr/bin/env bash
set -e

# Create output directory
mkdir -p libs/nx-help/dist

# Get all projects
# shellcheck disable=SC2312
PROJECTS=$(nx show projects --json 2>/dev/null | jq -r '.[]' | sort)

# Initialize JSON structure
echo '{
  "projects": [' > libs/nx-help/dist/projects.json

first=true
while IFS= read -r project; do
  if [[ -n "${project}" ]]; then
    # Get project details
    project_data=$(nx show project "${project}" --json 2>/dev/null) || continue

    if [[ -n "${project_data}" ]]; then
      # Add comma separator for all but first entry
      if [[ "${first}" == "true" ]]; then
        first=false
      else
        echo "    ," >> libs/nx-help/dist/projects.json
      fi

      # Extract project name and targets
      name=$(echo "${project_data}" | jq -r '.name')
      description=$(echo "${project_data}" | jq -r '.metadata.description // ""')

      # Build project entry with targets
      # shellcheck disable=SC2129
      echo "    {" >> libs/nx-help/dist/projects.json
      echo "      \"name\": \"${name}\"," >> libs/nx-help/dist/projects.json
      echo "      \"description\": \"${description}\"," >> libs/nx-help/dist/projects.json
      echo "      \"targets\": [" >> libs/nx-help/dist/projects.json

      # Extract targets
      targets=$(echo "${project_data}" | jq -r '.targets | to_entries[] | @json')
      target_first=true
      while IFS= read -r target_entry; do
        if [[ -n "${target_entry}" ]]; then
          target_name=$(echo "${target_entry}" | jq -r '.key')
          target_desc=$(echo "${target_entry}" | jq -r '.value.description // ""')

          if [[ "${target_first}" == "true" ]]; then
            target_first=false
          else
            echo "        ," >> libs/nx-help/dist/projects.json
          fi

          # shellcheck disable=SC2129
          echo "        {" >> libs/nx-help/dist/projects.json
          echo "          \"name\": \"${target_name}\"," >> libs/nx-help/dist/projects.json
          echo "          \"description\": \"${target_desc}\"" >> libs/nx-help/dist/projects.json
          echo -n "        }" >> libs/nx-help/dist/projects.json
        fi
      done <<< "${targets}"

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
