const toggleForm = () => {
    $(document).ready(function() {
        $('.editable-toggler').toggle()
        $('.editable').each(function() {
            const attr = {
                id: $(this).attr('id'),
                class: $(this).attr('class'),
                tag: $(this).data('tag') || 'input',
                type: $(this).data('type') || 'text',
                text: $(this).html(),
            }
            var input = $(`<${attr.tag}>`, {
                type: 'text',
                name: attr.id,
                value: attr.text,
                val: attr.text,
                class: attr.class,
                rows: 5,
            })
            input.addClass('form-control bg-glass-secondary-3')
            input.data('tag', attr.tag)
            input.data('type', attr.type)
            $(this).replaceWith(input)
        });
    });
}

const cancelForm = () => {
    $(document).ready(function() {
        $('.editable-toggler').toggle()
        $('.editable').each(function() {
            // Get the id of the current span
            const attr = {
                name: $(this).attr('name'),
                class: $(this).attr('class'),
                content: $(this).val(),
                tag: $(this).data('tag') || 'input',
                type: $(this).data('type') || 'text',
            }
            // Create a new span element
            var span = $(`<span>`, {
                id: attr.name,
                html: attr.content,
                class: attr.class
            });

            // Replace the span with the input
            span.removeClass('form-control bg-glass-secondary-3')
            span.data('tag', attr.tag)
            span.data('type', attr.type)
            $(this).replaceWith(span)
        });
        $('.marked-content').each(function() {
            $(this).html(marked.parse($(this).html()))
        });
    });
}

$(document).ready(function() {
    $('.marked-content').each(function() {
        $(this).html(marked.parse($(this).html()))
    });
});