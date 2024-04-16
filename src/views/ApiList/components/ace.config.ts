import ace from "ace-builds"

import modeJsonUrl from "ace-builds/src-noconflict/mode-json?url"
ace.config.setModuleUrl("ace/mode/json", modeJsonUrl)

import modeJson5Url from "ace-builds/src-noconflict/mode-json5?url"
ace.config.setModuleUrl("ace/mode/json5", modeJson5Url)

import modeJavascriptUrl from "ace-builds/src-noconflict/mode-javascript?url"
ace.config.setModuleUrl("ace/mode/javascript", modeJavascriptUrl)

import modeHtmlUrl from "ace-builds/src-noconflict/mode-html?url"
ace.config.setModuleUrl("ace/mode/html", modeHtmlUrl)

import modeYamlUrl from "ace-builds/src-noconflict/mode-yaml?url"
ace.config.setModuleUrl("ace/mode/yaml", modeYamlUrl)

import themeGithubUrl from "ace-builds/src-noconflict/theme-github?url"
ace.config.setModuleUrl("ace/theme/github", themeGithubUrl)

import themeChromeUrl from "ace-builds/src-noconflict/theme-chrome?url"
ace.config.setModuleUrl("ace/theme/chrome", themeChromeUrl)

import themeMonokaiUrl from "ace-builds/src-noconflict/theme-monokai?url"
ace.config.setModuleUrl("ace/theme/monokai", themeMonokaiUrl)

import workerBaseUrl from "ace-builds/src-noconflict/worker-base?url"
ace.config.setModuleUrl("ace/mode/base", workerBaseUrl)

import workerJsonUrl from "ace-builds/src-noconflict/worker-json?url"
ace.config.setModuleUrl("ace/mode/json_worker", workerJsonUrl)

import workerJavascriptUrl from "ace-builds/src-noconflict/worker-javascript?url"
ace.config.setModuleUrl("ace/mode/javascript_worker", workerJavascriptUrl)

import workerHtmlUrl from "ace-builds/src-noconflict/worker-html?url"
ace.config.setModuleUrl("ace/mode/html_worker", workerHtmlUrl)

import workerYamlUrl from "ace-builds/src-noconflict/worker-yaml?url"
ace.config.setModuleUrl("ace/mode/yaml_worker", workerYamlUrl)

import snippetsHtmlUrl from "ace-builds/src-noconflict/snippets/html?url"
ace.config.setModuleUrl("ace/snippets/html", snippetsHtmlUrl)

import snippetsJsUrl from "ace-builds/src-noconflict/snippets/javascript?url"
ace.config.setModuleUrl("ace/snippets/javascript", snippetsJsUrl)

import snippetsJsonUrl from "ace-builds/src-noconflict/snippets/json?url"
ace.config.setModuleUrl("ace/snippets/json", snippetsJsonUrl)

import snippetsJson5Url from "ace-builds/src-noconflict/snippets/json5?url"
ace.config.setModuleUrl("ace/snippets/json5", snippetsJson5Url)

// 启用自动补全等高级编辑支持，
import extSearchboxUrl from "ace-builds/src-noconflict/ext-searchbox?url"
ace.config.setModuleUrl("ace/ext/searchbox", extSearchboxUrl)

import "ace-builds/src-noconflict/ext-language_tools"
ace.require("ace/ext/language_tools")
