<?php

/*
| Plinth's components, as the site lists them: each has a page from its Markdown in
| site/components, a card on the components page, and, where it has variants, sizes or states, a
| playground. The playground's template is Blade, rendered live and printed in every layer
| (App\Components\Playground). `css` names its stylesheet when that isn't the component's own
| name.
*/

$variants = ['primary', 'accent', 'secondary', 'ghost', 'danger', 'danger-ghost'];
$controls = ['values' => ['sm', 'md', 'lg'], 'default' => 'md'];

return [

    'path' => base_path('components'),

    'groups' => ['Actions', 'Content', 'Navigation', 'Overlays'],

    'components' => [

        'button' => [
            'name' => 'Button',
            'group' => 'Actions',
            'description' => 'Does something: saves, submits, opens a sheet. Six variants, three sizes.',
            'playground' => [
                'template' => '<x-plinth::button{attributes}>{label}</x-plinth::button>',
                'options' => [
                    'variant' => [
                        'values' => $variants,
                        'default' => 'primary',
                        'content' => [
                            'primary' => ['{label}' => 'Save changes'],
                            'accent' => ['{label}' => 'Start free trial'],
                            'secondary' => ['{label}' => 'Cancel'],
                            'ghost' => ['{label}' => 'Skip'],
                            'danger' => ['{label}' => 'Delete project'],
                            'danger-ghost' => ['{label}' => 'Remove'],
                        ],
                    ],
                    'size' => $controls,
                ],
                'states' => ['busy', 'disabled'],
            ],
        ],

        'icon-button' => [
            'name' => 'Icon button',
            'group' => 'Actions',
            'description' => 'A button with only an icon, for toolbars, headers and closing a sheet.',
            'css' => 'button',
            'playground' => [
                'template' => '<x-plinth::icon-button label="Search"{attributes}><x-site.glyph name="search" /></x-plinth::icon-button>',
                'options' => [
                    'variant' => ['values' => $variants, 'default' => 'ghost'],
                    'size' => $controls,
                ],
                'states' => ['pressed', 'busy', 'disabled'],
            ],
        ],

        'avatar' => [
            'name' => 'Avatar',
            'group' => 'Content',
            'description' => 'A person or an organisation at a glance: image, then initials, then a glyph.',
            'playground' => [
                'template' => '<x-plinth::avatar name="Ana Lima"{attributes} />',
                'options' => [
                    'size' => ['values' => ['sm', 'md', 'lg', 'xl'], 'default' => 'md'],
                    'status' => [
                        'values' => ['none', 'success', 'warning', 'danger'],
                        'default' => 'none',
                        'print' => [
                            'success' => 'status="success" status-label="Online"',
                            'warning' => 'status="warning" status-label="Away"',
                            'danger' => 'status="danger" status-label="Busy"',
                        ],
                    ],
                ],
            ],
        ],

        'badge' => [
            'name' => 'Badge',
            'group' => 'Content',
            'description' => 'A short label for the status of something, next to what it describes.',
            'playground' => [
                'template' => '<x-plinth::badge{attributes}>{label}</x-plinth::badge>',
                'options' => [
                    'tone' => [
                        'values' => ['neutral', 'success', 'warning', 'danger'],
                        'default' => 'neutral',
                        'content' => [
                            'neutral' => ['{label}' => 'Draft'],
                            'success' => ['{label}' => 'Paid'],
                            'warning' => ['{label}' => 'Due soon'],
                            'danger' => ['{label}' => 'Overdue'],
                        ],
                    ],
                ],
                'states' => ['dot'],
            ],
        ],

        'callout' => [
            'name' => 'Callout',
            'group' => 'Content',
            'description' => 'A short message set apart from the page: a note, a tip, a warning.',
            'playground' => [
                'template' => '<x-plinth::callout{attributes} title="{title}">{text}</x-plinth::callout>',
                'options' => [
                    'tone' => [
                        'values' => ['neutral', 'info', 'success', 'warning', 'danger'],
                        'default' => 'neutral',
                        'content' => [
                            'neutral' => ['{title}' => 'Drafts are private', '{text}' => 'Only you can see an invoice until you send it.'],
                            'info' => ['{title}' => 'Invoices are sent at 9:00', '{text}' => 'Anything you schedule today goes out tomorrow morning.'],
                            'success' => ['{title}' => 'Invoice sent', '{text}' => 'The client gets a copy by email.'],
                            'warning' => ['{title}' => 'Your trial ends in 3 days', '{text}' => 'Pick a plan to keep your projects.'],
                            'danger' => ['{title}' => 'The export failed', '{text}' => 'Nothing was changed. Try again in a minute.'],
                        ],
                    ],
                ],
            ],
        ],

        'code-block' => [
            'name' => 'Code block',
            'group' => 'Content',
            'description' => 'Code to read and copy, with a label or tabs, highlighted on the server.',
        ],

        'data-table' => [
            'name' => 'Data table',
            'group' => 'Content',
            'description' => 'Records as cards on a phone and a table from 768px, from one markup, with no script.',
        ],

        'icon' => [
            'name' => 'Icon',
            'group' => 'Content',
            'description' => 'Sizes and colours a project\'s own SVG, and mirrors arrows in right-to-left text.',
            'playground' => [
                'template' => '<x-plinth::icon{attributes}><x-site.glyph name="check" /></x-plinth::icon>',
                'options' => [
                    'size' => ['values' => ['sm', 'md', 'lg'], 'default' => 'md'],
                ],
            ],
        ],

        'list-card' => [
            'name' => 'List card',
            'group' => 'Content',
            'description' => 'Related rows on a raised surface, with an optional heading and footer note.',
        ],

        'list-row' => [
            'name' => 'List row',
            'group' => 'Content',
            'description' => 'One row of a list: title, description, a leading and a trailing slot.',
            'playground' => [
                'template' => "<x-plinth::list-card>\n    <li><x-plinth::list-row href=\"#\" description=\"Monthly, by email\"{attributes}>Invoices</x-plinth::list-row></li>\n</x-plinth::list-card>",
                'states' => ['chevron', 'current', 'disabled'],
            ],
        ],

        'header' => [
            'name' => 'Header',
            'group' => 'Navigation',
            'description' => 'The phone shell\'s top bar: a leading action, the title and a few actions.',
        ],

        'pill-row' => [
            'name' => 'Pill row',
            'group' => 'Navigation',
            'description' => 'Filters, segments or sub-pages. Scrolls sideways and snaps on a phone.',
        ],

        'section-menu' => [
            'name' => 'Section menu',
            'group' => 'Navigation',
            'description' => 'The row under the header that switches between a page\'s sections.',
        ],

        'dialog' => [
            'name' => 'Dialog',
            'group' => 'Overlays',
            'description' => 'A modal for a form, details or settings, centred at every width.',
            'playground' => [
                'template' => "<x-plinth::button variant=\"secondary\" commandfor=\"playground-dialog\" command=\"show-modal\">Edit project</x-plinth::button>\n<x-plinth::dialog id=\"playground-dialog\" title=\"Edit project\" description=\"The name shows to everyone in the workspace.\"{attributes}>\n    <p>Rename the project, or move it to another workspace.</p>\n    <x-slot:footer>\n        <x-plinth::button variant=\"secondary\" commandfor=\"playground-dialog\" command=\"close\">Cancel</x-plinth::button>\n        <x-plinth::button commandfor=\"playground-dialog\" command=\"close\">Save</x-plinth::button>\n    </x-slot:footer>\n</x-plinth::dialog>",
                'options' => [
                    'dismissible' => [
                        'values' => ['true', 'false'],
                        'default' => 'true',
                        'print' => ['false' => ':dismissible="false"'],
                    ],
                    'side-phone' => ['values' => ['center', 'bottom'], 'default' => 'center'],
                ],
            ],
        ],

        'confirm-dialog' => [
            'name' => 'Confirmation dialog',
            'group' => 'Overlays',
            'description' => 'Asks before an action happens: a yes, a phrase typed exactly, or a password.',
            'playground' => [
                'template' => "<x-plinth::button variant=\"secondary\" commandfor=\"playground-confirm\" command=\"show-modal\">{opener}</x-plinth::button>\n<x-plinth::confirm-dialog id=\"playground-confirm\" title=\"{title}\" message=\"{message}\" confirm-label=\"{confirm}\"{attributes} />",
                'options' => [
                    'kind' => [
                        'values' => ['simple', 'type', 'password'],
                        'default' => 'simple',
                        'print' => ['type' => 'kind="type" phrase="harbour"'],
                        'content' => [
                            'simple' => ['{opener}' => 'Archive 3 tickets', '{title}' => 'Archive 3 tickets?', '{message}' => 'You can bring them back from the archive.', '{confirm}' => 'Archive'],
                            'type' => ['{opener}' => 'Delete project', '{title}' => 'Delete this project?', '{message}' => 'Its tickets and files go with it, and this cannot be undone.', '{confirm}' => 'Delete project'],
                            'password' => ['{opener}' => 'Change billing email', '{title}' => 'Change the billing email?', '{message}' => 'Enter your password to go on.', '{confirm}' => 'Change email'],
                        ],
                    ],
                    'tone' => ['values' => ['neutral', 'danger'], 'default' => 'neutral'],
                ],
                'states' => ['busy'],
            ],
        ],

        'drawer' => [
            'name' => 'Drawer',
            'group' => 'Overlays',
            'description' => 'A bottom panel the person drags on a phone, with snap points; a dialog or a sheet on a desktop.',
            'playground' => [
                'template' => "<x-plinth::button variant=\"secondary\" commandfor=\"playground-drawer\" command=\"show-modal\">Show the route</x-plinth::button>\n<x-plinth::drawer id=\"playground-drawer\" title=\"Route to the library\" description=\"12 min by bike, 3.4 km.\"{attributes}>\n    <p>Head north on Harbour Road, cross the old bridge, and the library is on the left.</p>\n</x-plinth::drawer>",
                'options' => [
                    'snap-points' => ['values' => ['none', 'peek half full', 'half full'], 'default' => 'none'],
                    'desktop' => ['values' => ['dialog', 'sheet'], 'default' => 'dialog'],
                ],
            ],
        ],

        'menu-sheet' => [
            'name' => 'Menu sheet',
            'group' => 'Overlays',
            'description' => 'The app shell\'s menu: the signed-in user, navigation and account actions.',
        ],

        'sheet' => [
            'name' => 'Sheet',
            'group' => 'Overlays',
            'description' => 'A modal panel on the edge you pick, at every width, and another on a phone.',
            'playground' => [
                'template' => "<x-plinth::button variant=\"secondary\" commandfor=\"playground-sheet\" command=\"show-modal\">Filters</x-plinth::button>\n<x-plinth::sheet id=\"playground-sheet\" title=\"Filters\"{attributes}>\n    <p>Show the invoices that are due this month.</p>\n</x-plinth::sheet>",
                'options' => [
                    'side' => ['values' => ['end', 'start', 'top', 'bottom'], 'default' => 'end'],
                    'side-phone' => ['values' => ['none', 'start', 'end', 'top', 'bottom'], 'default' => 'none'],
                ],
            ],
        ],

    ],

    /*
    | The components that are coming, by their issue.
    */

    'coming' => [],

];
